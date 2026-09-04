import React, { useState } from 'react';
import {
  BookOpen,
  Clock,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Calculator,
  ChevronRight,
  Share2
} from 'lucide-react';
import { SEO_ARTICLES } from '../data/seoArticlesData';
import { SeoArticle, CategoryId } from '../types';

interface Props {
  onOpenCalculator: (id: CategoryId) => void;
}

export const SeoArticlesView: React.FC<Props> = ({ onOpenCalculator }) => {
  const [selectedArticleId, setSelectedArticleId] = useState<string>(SEO_ARTICLES[0].id);

  const activeArticle = SEO_ARTICLES.find((a) => a.id === selectedArticleId) || SEO_ARTICLES[0];

  return (
    <div className="py-14 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-black uppercase tracking-wider text-blue-600">
            SEO Authority & Valuation Library
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-950 mt-2 tracking-tight">
            The Finish Line Guides
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-medium mt-3 leading-relaxed">
            Data-driven reports on stalled construction, basement ROI mathematics, and navigating the 70% DIY burnout threshold.
          </p>
        </div>

        {/* 3 Articles Switcher Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {SEO_ARTICLES.map((article) => {
            const isSelected = article.id === activeArticle.id;
            return (
              <div
                key={article.id}
                onClick={() => setSelectedArticleId(article.id)}
                className={`p-6 rounded-2xl border-2 transition cursor-pointer select-none ${
                  isSelected
                    ? 'bg-blue-50/70 border-blue-600 shadow-md ring-2 ring-blue-600/20'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2.5">
                  <span className="font-black text-xs uppercase tracking-wider text-blue-700">{article.category}</span>
                  <span className="flex items-center gap-1 text-xs font-bold text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    {article.readTime}
                  </span>
                </div>
                <h3 className="font-black text-base text-slate-950 leading-snug tracking-tight">
                  {article.title}
                </h3>
                <p className="text-xs text-slate-600 font-medium mt-2 line-clamp-2 leading-relaxed">
                  {article.subtitle}
                </p>
              </div>
            );
          })}
        </div>

        {/* Active Article Full Reader */}
        <div className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-xs">
          <div className="max-w-3xl mx-auto">
            {/* Meta header */}
            <div className="border-b border-slate-200 pb-8 mb-8">
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 font-bold mb-4">
                <span className="px-3 py-1 rounded-md bg-blue-100 text-blue-900 font-black uppercase tracking-tight">
                  {activeArticle.category}
                </span>
                <span>•</span>
                <span>Focus Keyword: <code className="bg-slate-200 px-2 py-0.5 rounded text-slate-900 font-black">{activeArticle.focusKeyword}</code></span>
                <span>•</span>
                <span>{activeArticle.readTime}</span>
                <span>•</span>
                <span>{activeArticle.publishedDate}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight leading-tight">
                {activeArticle.title}
              </h1>
              <p className="text-base sm:text-xl text-slate-600 mt-4 font-medium leading-relaxed">
                {activeArticle.subtitle}
              </p>
            </div>

            {/* Key Takeaways Box */}
            <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 sm:p-8 mb-8 shadow-xs">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-950 flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 stroke-[2.5]" />
                <span>Executive Summary & Key Takeaways</span>
              </h3>
              <ul className="space-y-3 text-sm text-slate-700 font-medium leading-relaxed">
                {activeArticle.keyTakeaways.map((takeaway, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0" />
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Article Sections */}
            <div className="space-y-8 text-base text-slate-700 font-medium leading-relaxed">
              {activeArticle.contentSections.map((sec, idx) => (
                <div key={idx} className="space-y-3.5">
                  <h2 className="text-2xl font-black text-slate-950 pt-2 tracking-tight">
                    {sec.heading}
                  </h2>
                  {sec.paragraphs.map((p, pIdx) => (
                    <p key={pIdx} className="text-slate-600">
                      {p}
                    </p>
                  ))}
                  {sec.highlightBox && (
                    <div className="my-5 p-5 rounded-2xl bg-blue-50 border-l-4 border-blue-600 text-sm font-bold text-blue-950 leading-relaxed shadow-xs">
                      {sec.highlightBox}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Bottom Call to Action for Calculator */}
            <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-5 bg-white p-6 sm:p-8 rounded-2xl border-2 border-slate-200 shadow-xs">
              <div>
                <span className="text-xs font-black text-blue-600 uppercase tracking-wider block">
                  Interactive Computation
                </span>
                <div className="font-black text-slate-950 text-lg sm:text-xl mt-1 tracking-tight">
                  Ready to calculate your specific numbers?
                </div>
                <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
                  Input your exact square footage or milestone progress in our free calculator.
                </p>
              </div>
              <button
                onClick={() => onOpenCalculator(activeArticle.relatedCalculator)}
                className="shrink-0 inline-flex items-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-black text-sm tracking-tight rounded-xl transition shadow-md"
              >
                <span>Launch Calculator</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
