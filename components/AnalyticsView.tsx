
import React, { useState } from 'react';
import { Task, Workspace } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Sparkles, BrainCircuit, RefreshCw, ChevronRight } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface AnalyticsViewProps {
  tasks: Task[];
  workspaces: Workspace[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ tasks, workspaces }) => {
  const [aiAnalysis, setAiAnalysis] = useState<{ review: string; recommendations: string } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const completedCount = tasks.filter(t => t.status === 'Completed').length;
  const pendingCount = tasks.filter(t => t.status === 'Pending').length;
  const completionRate = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const pieData = [
    { name: 'Completed', value: completedCount },
    { name: 'Pending', value: pendingCount },
  ];

  const barData = workspaces.map(ws => ({
    name: ws.name,
    tasks: tasks.filter(t => t.workspaceId === ws.id).length
  }));

  const COLORS = ['#10B981', '#F59E0B'];

  const generateAIInsights = async () => {
    setIsAnalyzing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const taskContext = tasks.map(t => ({
        title: t.title,
        status: t.status,
        workspace: workspaces.find(w => w.id === t.workspaceId)?.name || 'Unknown'
      }));

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze this task data: ${JSON.stringify(taskContext)}. 
        Provide a concise "Review" of current progress and specific "Recommendations" for improving productivity. 
        Format your response as a JSON object with two keys: "review" and "recommendations". 
        Keep the tone professional and insightful.`,
        config: {
          responseMimeType: "application/json",
        }
      });

      const result = JSON.parse(response.text || '{}');
      setAiAnalysis(result);
    } catch (error) {
      console.error("AI Analysis failed:", error);
      setAiAnalysis({
        review: "Unable to complete analysis at this time. Please check your connectivity.",
        recommendations: "Ensure you have an active workspace and try again shortly."
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* AI Section */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-blue-600 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
        <div className="relative glass rounded-[2.5rem] p-8 overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-xl">
                <BrainCircuit className="text-white" size={30} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Lumina AI Assistant</h2>
                <p className="text-gray-400 text-sm">Deep project analysis & behavioral recommendations</p>
              </div>
            </div>
            <button 
              onClick={generateAIInsights}
              disabled={isAnalyzing}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-purple-900/20 
                ${isAnalyzing ? 'bg-purple-800 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-500'}`}
            >
              {isAnalyzing ? <RefreshCw className="animate-spin" size={20} /> : <Sparkles size={20} />}
              {isAnalyzing ? 'Analyzing Data...' : 'Generate Intelligence Report'}
            </button>
          </div>

          {aiAnalysis ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-purple-400 font-bold uppercase text-[10px] tracking-widest">
                  <ChevronRight size={14} />
                  Project Review
                </div>
                <div className="p-6 rounded-3xl bg-white/5 border border-white/5 text-gray-300 leading-relaxed italic">
                  "{aiAnalysis.review}"
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-blue-400 font-bold uppercase text-[10px] tracking-widest">
                  <ChevronRight size={14} />
                  Recommendations
                </div>
                <div className="p-6 rounded-3xl bg-white/5 border border-white/5 text-gray-300 leading-relaxed">
                  {aiAnalysis.recommendations}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center opacity-40">
              <Sparkles size={40} className="mb-4 text-purple-400" />
              <p className="max-w-md">Click the button above to have Lumina AI review your workspaces and provide strategic recommendations based on your task history.</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Completion Distribution */}
        <div className="glass rounded-3xl p-8 h-96 flex flex-col border-white/5">
          <div className="mb-6">
            <h3 className="text-xl font-bold">Status Distribution</h3>
            <p className="text-gray-400 text-sm">Overall task completion status.</p>
          </div>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e1b4b', border: 'none', borderRadius: '12px' }} 
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-8 text-sm">
            <div className="flex items-center gap-2 font-medium">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span>Completed ({completedCount})</span>
            </div>
            <div className="flex items-center gap-2 font-medium">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <span>Pending ({pendingCount})</span>
            </div>
          </div>
        </div>

        {/* Workspace Activity */}
        <div className="glass rounded-3xl p-8 h-96 flex flex-col border-white/5">
          <div className="mb-6">
            <h3 className="text-xl font-bold">Workspace Loading</h3>
            <p className="text-gray-400 text-sm">Tasks distributed by workspace.</p>
          </div>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name" stroke="#6b7280" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7280" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#1e1b4b', border: 'none', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="tasks" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Big Number Insights */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="glass rounded-3xl p-8 flex flex-col items-center justify-center text-center border-white/5 hover:bg-white/[0.05] transition-colors">
              <span className="text-5xl font-black text-purple-400 mb-2">{completionRate}%</span>
              <span className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.2em]">Efficiency Rating</span>
           </div>
           <div className="glass rounded-3xl p-8 flex flex-col items-center justify-center text-center border-white/5 hover:bg-white/[0.05] transition-colors">
              <span className="text-5xl font-black text-pink-400 mb-2">{tasks.length}</span>
              <span className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.2em]">Total Objectives</span>
           </div>
           <div className="glass rounded-3xl p-8 flex flex-col items-center justify-center text-center border-white/5 hover:bg-white/[0.05] transition-colors">
              <span className="text-5xl font-black text-blue-400 mb-2">{workspaces.length}</span>
              <span className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.2em]">Active Portfolios</span>
           </div>
        </div>
      </div>
    </div>
  );
};
