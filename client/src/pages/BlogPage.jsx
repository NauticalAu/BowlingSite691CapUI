// src/pages/BlogPage.jsx
import React from 'react';
import Layout from '../components/Layout';

function BlogPage() {
  return (
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 space-y-8">
        <h1 className="text-4xl font-bold text-center text-secondary">📝 Bowling Hub Blog</h1>

        <article>
          <h2 className="text-2xl font-bold text-primary mb-2">🎳 The History of Bowling</h2>
          <p className="text-[18px] text-gray-700 leading-relaxed">
            Bowling dates back thousands of years to ancient Egypt. Over time, it evolved into
            the modern 10-pin game we know today. Bowling remains one of the most popular recreational
            sports worldwide.
          </p>
        </article>

        <article>
          <h2 className="text-2xl font-bold text-primary mb-2">💡 Tips to Improve Your Score</h2>
          <ul className="list-disc list-inside text-[18px] text-gray-700 leading-relaxed">
            <li>Focus on your footwork and timing</li>
            <li>Choose the right ball weight</li>
            <li>Practice your release angle</li>
            <li>Keep your eyes on the target arrows</li>
          </ul>
        </article>

        <article>
          <h2 className="text-2xl font-bold text-primary mb-2">📅 Upcoming Tournaments</h2>
          <p className="text-[18px] text-gray-700 leading-relaxed">
            Stay tuned for our 2025 summer league schedule! We’ll be hosting events in multiple cities
            with divisions for all skill levels.
          </p>
        </article>
      </div>
  );
}

export default BlogPage;
