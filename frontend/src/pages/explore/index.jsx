import React, { useEffect, useState } from 'react';
import NavBar from '../../components/Navbar';

const Explore = () => {
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:8000/datasets')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch datasets');
        return res.json();
      })
      .then((data) => {
        console.log(data)
        console.log(`/imgs/${data[0].img}`)
        setDatasets(data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Could not load datasets.');
        setLoading(false);
      });
  }, []);

  return (
    <main style={{ padding: '0 0 4rem 0' }}>
        <NavBar />
      <div className="container">
        <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Explore Datasets</h1>
        <p className="section-subtext">Choose a dataset to start exploring and analyzing data.</p>
        {loading && <div style={{ textAlign: 'center' }}>Loading...</div>}
        {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
        <div className="cards-grid four" style={{ marginTop: '2rem' }}>
          {datasets.map((ds, idx) => (
            <div className="card" key={idx} style={{ padding: '2rem', borderRadius: '14px', background: 'rgba(26, 31, 58, 0.75)', boxShadow: '0 12px 30px rgba(9, 12, 32, 0.15)' }}>
              <div className="card-icon" style={{ marginBottom: '1rem' }}>
                {/* <svg width="32" height="32" viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" fill="#3B82F6" opacity="0.15" />
                  <path d="M7 12h10M12 7v10" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
                </svg> */}
                <img src={`/imgs/${ds.img}`} style={{ borderRadius: '10px', width: '7rem', maxHeight: '90%' }} alt="img here" />
                {/* <img src={`${import.meta.env.BASE_URL}imgs/${ds.img}`} width={32} alt={ds.title} /> */}
              </div>
              <h2 style={{ marginBottom: '0.5rem' }}>{ds.title}</h2>
              <p className="card-text">{ds.description}</p>
              <button className="btn btn-primary" style={{ marginTop: '1rem' }}>
                Explore
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Explore;