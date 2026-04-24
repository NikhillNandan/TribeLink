import socketio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import time
import random
import string
import datetime
import asyncio

# Create FastAPI app
fastapi_app = FastAPI()

# Add CORS middleware
fastapi_app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root API endpoint to check if server is running
@fastapi_app.get("/api/health")
def read_root():
    return {"status": "TribeLink Live Server is running"}

# Create Socket.IO server
# async_mode='asgi' is needed for FastAPI
sio = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins='*')

# Wrap FastAPI app with Socket.IO ASGI app
app = socketio.ASGIApp(sio, other_asgi_app=fastapi_app)

queues = {} # e.g. { "CSK": [{"sid": sid, "visitorId": id, "fanCode": code}] }
active_rooms = {} # maps sid to room_id
connected_clients = set()

@sio.on('connect')
async def connect(sid, environ):
    connected_clients.add(sid)
    print(f"⚡ Fan connected: {sid}")
    await sio.emit('active_users_update', len(connected_clients))

@sio.on('get_active_users')
async def get_active_users(sid, data=None):
    await sio.emit('active_users_update', len(connected_clients), to=sid)

@sio.on('join_queue')
async def join_queue(sid, data):
    team = data.get('team')
    visitor_id = data.get('visitorId')
    fan_code = data.get('fanCode')
    
    print(f"[Queue] Fan {fan_code} joining {team} queue")
    
    if team not in queues:
        queues[team] = []
        
    # Find any waiting fan of the same team
    waiting_fan_index = -1
    for i, f in enumerate(queues[team]):
        if f['visitorId'] != visitor_id:
            waiting_fan_index = i
            break
            
    if waiting_fan_index != -1:
        opponent = queues[team].pop(waiting_fan_index)
        room_id = f"room_{int(time.time())}_{''.join(random.choices(string.ascii_lowercase + string.digits, k=6))}"
        
        await sio.enter_room(sid, room_id)
        await sio.enter_room(opponent['sid'], room_id)
        
        active_rooms[sid] = room_id
        active_rooms[opponent['sid']] = room_id
        
        await sio.emit('match_found', {'roomId': room_id, 'opponentFanCode': opponent['fanCode'], 'opponentId': opponent['visitorId']}, to=sid)
        await sio.emit('match_found', {'roomId': room_id, 'opponentFanCode': fan_code, 'opponentId': visitor_id}, to=opponent['sid'])
        print(f"[Match] {fan_code} matched with {opponent['fanCode']} in {room_id}")
    else:
        # Ensure not already in queue
        queues[team] = [f for f in queues[team] if f['visitorId'] != visitor_id]
        queues[team].append({'sid': sid, 'visitorId': visitor_id, 'fanCode': fan_code})

@sio.on('send_message')
async def send_message(sid, data):
    room_id = active_rooms.get(sid)
    if room_id:
        msg_id = str(int(time.time() * 1000))
        # Broadcast to everyone else in the room
        await sio.emit('receive_message', {
            'id': msg_id,
            'text': data.get('text'),
            'sender': 'match',
            'timestamp': datetime.datetime.now().isoformat()
        }, room=room_id, skip_sid=sid)

async def handle_disconnect_or_skip(sid):
    room_id = active_rooms.get(sid)
    if room_id:
        await sio.emit('opponent_left', room=room_id, skip_sid=sid)
        
        sio.leave_room(sid, room_id)
        del active_rooms[sid]

    for team in queues:
        queues[team] = [f for f in queues[team] if f['sid'] != sid]

@sio.on('skip_match')
async def skip_match(sid, data):
    await handle_disconnect_or_skip(sid)
    team = data.get('team')
    visitor_id = data.get('visitorId')
    fan_code = data.get('fanCode')
    
    if team:
        await asyncio.sleep(0.5)
        await sio.emit('finding_new_match', to=sid)
        if team not in queues:
            queues[team] = []
        queues[team].append({'sid': sid, 'visitorId': visitor_id, 'fanCode': fan_code})

@sio.on('disconnect')
async def disconnect(sid):
    if sid in connected_clients:
        connected_clients.remove(sid)
    await handle_disconnect_or_skip(sid)
    print(f"🔌 Fan disconnected: {sid}")
    await sio.emit('active_users_update', len(connected_clients))
