import { motion } from "framer-motion";
import { Link } from "react-router";
import { BookOpen, ArrowLeft, Calendar, User } from "lucide-react";

// Mock data for blog posts - in a real app, this would come from a CMS or API
const blogPosts = [
  {
    id: 1,
    title: "The Evolution of T20 Cricket: How the IPL Changed the Game",
    excerpt: "From its inception in 2008 to the modern era, the Indian Premier League has revolutionized how cricket is played, watched, and celebrated globally.",
    date: "April 24, 2024",
    author: "Cricket Fanatic",
    category: "IPL History",
    imageUrl: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Top 5 Rivalries in IPL History That Keep Fans on the Edge",
    excerpt: "El Clasico of the IPL, the Southern Derby, and more. We dive deep into the most intense rivalries that define the spirit of the tournament.",
    date: "April 20, 2024",
    author: "Sports Analyst",
    category: "Rivalries",
    imageUrl: "https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Why Finding Your 'Tribe' Enhances the Match-Day Experience",
    excerpt: "Watching sports is fundamentally a social experience. Connecting with fellow fans who share your passion amplifies the joy of victory and cushions the blow of defeat.",
    date: "April 15, 2024",
    author: "TribeLink Team",
    category: "Community",
    imageUrl: "https://images.unsplash.com/photo-1506869640319-fea1a275386b?q=80&w=1000&auto=format&fit=crop"
  }
];

export default function Blog() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-300 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background styling */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <Link to="/" className="inline-flex items-center text-yellow-400 hover:text-yellow-300 mb-8 transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </Link>

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-yellow-400/10 rounded-2xl border border-yellow-400/20">
                <BookOpen className="w-8 h-8 text-yellow-400" />
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">TribeLink Blog</h1>
            </div>
            <p className="text-xl text-gray-400 max-w-2xl">
              Insights, stories, and analysis from the world of cricket and fan culture.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-yellow-400/50 transition-colors group cursor-pointer"
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={post.imageUrl} 
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <div className="text-yellow-400 text-sm font-semibold mb-3 tracking-wider uppercase">
                  {post.category}
                </div>
                <h2 className="text-xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors">
                  {post.title}
                </h2>
                <p className="text-gray-400 text-sm line-clamp-3 mb-6">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500 border-t border-white/10 pt-4 mt-auto">
                  <div className="flex items-center gap-2">
                    <User className="w-3 h-3" />
                    {post.author}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    {post.date}
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}
