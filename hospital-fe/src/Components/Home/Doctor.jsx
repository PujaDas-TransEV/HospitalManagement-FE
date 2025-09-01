
import React, { useState, useEffect } from "react";

const DoctorsSection = () => {
  const [allDocs, setAllDocs] = useState([]);
  const [page, setPage] = useState(0);
  const [modalDoc, setModalDoc] = useState(null);

  useEffect(() => {
    fetch("https://backend.medapp.transev.site/doctorops/getalldoctor")
      .then((res) => res.json())
      .then((json) => setAllDocs(json.data || []))
      .catch(console.error);
  }, []);

  const perPage = 4;
  const totalPages = Math.ceil(allDocs.length / perPage);
  const shown = allDocs.slice(page * perPage, page * perPage + perPage);

  return (
    <section
      style={{
        backgroundColor: "#e5f0ff",
        padding: "60px 5%",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "40px",
          marginLeft:'150px',
 
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <p
              style={{
                fontSize: "20px",
                color: "#c2192fff",
                margin: 0,
                marginRight: "8px",
              }}
            >
              Doctors
            </p>
            <div
              style={{
                position: "relative",
                width: "60px",
                height: "3px",
                backgroundColor: "#c2192fff",
                borderRadius: "2px",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "-4px",
                  width: "10px",
                  height: "10px",
                  backgroundColor: "#c2192fff",
                  borderRadius: "50%",
                }}
              />
            </div>
          </div>
          <h2 style={{ fontSize: "28px", color: "#053f7eff", margin: 0 }}>
            Our Consultants
          </h2>
        </div>
        <button
          onClick={() => (window.location.href = "/doctors/all")}
          style={{
            padding: "8px 16px",
            backgroundColor: "#0056b3",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          View All
        </button>
      </div>

      {/* Doctor Profiles */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "16px",
          marginBottom: "20px",
        }}
      >
        {shown.map((doc) => {
          const imgSrc = doc.profile_image
            ? `data:image/jpeg;base64,${doc.profile_image}`
            : null;
          return (
            <div
              key={doc.uid}
              style={{
                textAlign: "center",
                maxWidth: "300px",
                flex: "1 0 180px",
                animation: "fadeIn 0.4s",
              }}
            >
              <div
                style={{
                  width: "200px",
                  height: "200px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  background: "#ddd",
                  margin: "0 auto 12px",
                }}
              >
                {imgSrc ? (
                  <img
                    src={imgSrc}
                    alt={doc.fullname}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#888",
                      fontSize: "14px",
                    }}
                  >
                    No Image
                  </div>
                )}
              </div>
              <h3 style={{ fontSize: "18px", margin: "6px 0",color:'#053f7eff' }}> Dr. {doc.fullname}</h3>
              <p
                style={{
                  fontSize: "18px",
                  color: "#555",
                  margin: "4px 0",
                  textTransform: "capitalize",
                }}
              >
                {doc.specialization}
              </p>
              <button
                onClick={() => setModalDoc(doc)}
                style={{
                  padding: "6px 12px",
                  backgroundColor: "#E4A400",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                View Details
              </button>
            </div>
          );
        })}
      </div>

      {/* Pagination Dots */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "8px",
          marginBottom: "40px",
        }}
      >
        {Array.from({ length: totalPages }).map((_, idx) => (
          <div
            key={idx}
            onClick={() => setPage(idx)}
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: idx === page ? "#0056b3" : "#aaa",
              cursor: "pointer",
              transition: "background-color 0.3s",
            }}
          />
        ))}
      </div>

    
{modalDoc && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      zIndex: 1000,
    }}
  >
    <div
      style={{
        background: "#fff",
        padding: "24px",
        borderRadius: "12px",
        maxWidth: "700px",
        width: "100%",
        position: "relative",
        display: "flex",
        flexWrap: "wrap",
        gap: "24px",
        boxShadow: "0 0 20px rgba(0,0,0,0.2)",
      }}
    >
      {/* Close Button */}
      <button
        onClick={() => setModalDoc(null)}
        style={{
          position: "absolute",
          top: "-10px",
          right: "12px",
          background: "none",
          border: "none",
          fontSize: "20px",
          cursor: "pointer",
        }}
        aria-label="Close modal"
      >
        ×
      </button>

      {/* Left Side Content */}
      <div style={{ flex: "1 1 400px", minWidth: "280px" }}>
    
        <h2
  style={{
    marginBottom: "6px",
    fontSize: "22px",
    color: "#0056b3",
  }}
>
  Dr. {modalDoc.fullname}
  {modalDoc.specialization && (
    <span style={{ fontSize: "22px", color: "#0056b3", fontWeight: "normal" }}>
      {" "}({modalDoc.specialization})
    </span>
  )}
</h2>

        <p
          style={{
            margin: "4px 0 20px",
            textTransform: "capitalize",
            fontWeight: "700",
            color: "black",
          }}
        >
          {modalDoc.qualification}
        </p>
       

        <h4 style={{ marginBottom: "10px", fontSize: "16px", color:'red' }}>Clinic Time</h4>

        {/* Scrollable Table if needed */}
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              minWidth: "380px",
              borderCollapse: "collapse",
              fontSize: "14px",
            }}
          >
            <thead>
              <tr>
                 <th style={{ textAlign: "left", padding: "6px 10px", borderBottom: "1px solid #ccc" }}>
                  Date
                </th>
                <th style={{ textAlign: "left", padding: "6px 10px", borderBottom: "1px solid #ccc" }}>
                  Day
                </th>
                <th style={{ textAlign: "left", padding: "6px 10px", borderBottom: "1px solid #ccc" }}>
                  Time
                </th>
              </tr>
            </thead>
          
            <tbody>
  {modalDoc.timetable?.map((day, di) =>
    day.schedule.map((slot, si) => {
      const dateObj = new Date(day.date);

      const dateStr = dateObj.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

      const weekday = dateObj.toLocaleDateString("en-US", {
        weekday: "short",
      });

      const formatTime = (timeStr) => {
        const [hour, minute] = timeStr.split(":");
        const date = new Date();
        date.setHours(Number(hour), Number(minute));
        return date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
      };

      return (
        <tr key={`${di}-${si}`}>
          <td style={{ padding: "6px 10px", borderBottom: "1px solid #eee" }}>
            {dateStr}
          </td>
          <td style={{ padding: "6px 10px", borderBottom: "1px solid #eee" }}>
            {weekday}
          </td>
          <td style={{ padding: "6px 10px", borderBottom: "1px solid #eee" }}>
            {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
          </td>
        </tr>
      );
    })
  )}
</tbody>
          </table>
        </div>
      </div>

      {/* Right Side Image */}
      <div
        style={{
          flex: "0 0 200px",
          height: "240px",
          background: "#f0f0f0",
          borderRadius: "10px",
          overflow: "hidden",
          alignSelf: "flex-start",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        {modalDoc.profile_image ? (
          <img
            src={`data:image/jpeg;base64,${modalDoc.profile_image}`}
            alt={`Dr. ${modalDoc.fullname}`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#888",
              fontSize: "14px",
            }}
          >
            No Image
          </div>
        )}
      </div>
    </div>
  </div>
)}


      {/* Animation */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 600px) {
          .doctor-card {
            flex: 1 0 100%;
            max-width: 100%;
          }
        }
      `}</style>
    </section>
  );
};

export default DoctorsSection;
