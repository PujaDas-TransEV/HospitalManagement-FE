import React from 'react';
import blog1 from '../Assests/1752151637.webp';
import blog2 from '../Assests/1752765869.webp';
import blog3 from '../Assests/1753355554.webp';

const blogs = [
  {
    img: blog1,
    date: '24th July, 2025',
    category: 'Health Care',
    title: 'Digestive Health Tips: Lifestyle Habits to Support Your Gut',
  },
  {
    img: blog2,
    date: '17th July, 2025',
    category: 'Health Care',
    title: 'Cathlab - As a Patient, What to Look for in a Good Cathlab Setup',
  },
  {
    img: blog3,
    date: '10th July, 2025',
    category: 'Health Care',
    title: 'Understanding Chronic Inflammatory Arthritis: Causes, Symptoms & Treatment Options',
  },
];

const RecentBlogs = () => {
  const handleViewAll = () => window.location.href = '/blogs';

  return (
    <>
      <style>{`
        .recent-section {
          background-color: #e3f2fd;
          padding: 60px 5%;
          font-family: Arial, sans-serif;
        }

        .recent-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
          flex-wrap: wrap;
        }

        .left-header {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .small-title {
          font-size: 14px;
          font-weight: bold;
          color: #d32f2f;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .small-title .divider {
          width: 1px;
          height: 20px;
          background-color: #555;
        }

        .small-title .dot {
          width: 8px;
          height: 8px;
          background-color: #555;
          border-radius: 50%;
        }

        .big-heading {
          font-size: 32px;
          font-weight: bold;
          color: #1976d2;
          text-transform: uppercase;
        }

        .view-all-btn {
          padding: 12px 28px;
          background-color: #ffd700;
          color: #000;
          font-size: 16px;
          font-weight: bold;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .view-all-btn:hover {
          background-color: #e6c200;
        }

        .cards {
          display: flex;
          gap: 24px;
          flex-wrap: wrap;
        }

        .blog-card {
          width: calc(33.333% - 16px);
          background: #fff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 6px 15px rgba(0,0,0,0.1);
          display: flex;
          flex-direction: column;
        }

        .blog-card img {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-radius: 12px 12px 0 0;
        }

        .blog-content {
          padding: 16px;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .blog-date {
          font-size: 14px;
          color: #777;
        }

        .blog-category {
          font-size: 12px;
          color: #1976d2;
          font-weight: bold;
        }

        .blog-title {
          font-size: 18px;
          font-weight: bold;
          color: #222;
          flex-grow: 1;
        }

        .read-more-btn {
          margin-top: 12px;
          padding: 8px 20px;
          background-color: #ffd700;
          color: #000;
          font-size: 14px;
          font-weight: bold;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          align-self: flex-start;
        }

        .read-more-btn:hover {
          background-color: #e6c200;
        }

        @media (max-width: 1024px) {
          .blog-card { width: calc(50% - 16px); }
        }

        @media (max-width: 600px) {
          .recent-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 20px;
          }

          .blog-card {
            width: 100%;
          }

          .view-all-btn {
            align-self: flex-start;
          }
        }
      `}</style>

      <section className="recent-section" aria-label="Recent Blogs">
        <div className="recent-header">
          <div className="left-header">
            <div className="small-title">
              Keeping You Well
              <div className="divider" />
              <div className="dot" />
            </div>
            <div className="big-heading">Recent Blogs</div>
          </div>
          <button className="view-all-btn" onClick={handleViewAll}>View All</button>
        </div>

        <div className="cards">
          {blogs.map((b, i) => (
            <div key={i} className="blog-card" role="article">
              <img src={b.img} alt={b.title} />
              <div className="blog-content">
                <div className="blog-date">{b.date}</div>
                <div className="blog-category">{b.category}</div>
                <div className="blog-title">{b.title}</div>
                <button
                  className="read-more-btn"
                  onClick={() => window.location.href = `/blog/${i}`}
                >
                  Read More
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default RecentBlogs;
