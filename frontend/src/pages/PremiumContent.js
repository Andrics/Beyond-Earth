import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import StarsBackground from '../components/StarsBackground';
import { FiLock } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import { GiBlackHoleBolas } from 'react-icons/gi';

const PremiumContent = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('videos');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchPremiumContent();
  }, []);

  const fetchPremiumContent = async () => {
    try {
      const response = await api.get('/content/premium');
      setContent(response.data);
    } catch (error) {
      if (error.response?.status === 403) {
        setError('You need an active subscription to access premium content.');
      } else {
        setError('Failed to load premium content.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading premium content...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="premium-content-page">
        <StarsBackground />
        <div className="container">
          <div className="section">
            <div className="card" style={{ maxWidth: '600px', margin: '100px auto', textAlign: 'center' }}>
              <div style={{ fontSize: '4rem', marginBottom: '20px', color: '#f093fb' }}>
                <FiLock />
              </div>
              <h2 style={{ marginBottom: '20px', color: '#f093fb' }}>Premium Access Required</h2>
              <p style={{ color: '#d0d0d0', marginBottom: '30px' }}>{error}</p>
              <Link to="/subscription" className="btn btn-primary">
                Subscribe Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="premium-content-page">
      <StarsBackground />
      <div className="container">
        <div className="section">
          <h1 className="section-title">Premium Space Content</h1>
          <p style={{ textAlign: 'center', marginBottom: '50px', color: '#d0d0d0' }}>
            Exclusive high-quality content for premium subscribers
          </p>

          {user?.subscription?.isActive && (
            <div className="card" style={{ maxWidth: '600px', margin: '0 auto 50px', textAlign: 'center', background: 'rgba(102, 126, 234, 0.2)' }}>
              <p style={{ color: '#667eea', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                <FaStar />
                Premium {user.subscription.plan.charAt(0).toUpperCase() + user.subscription.plan.slice(1)} Plan Active
              </p>
              <p style={{ color: '#d0d0d0', fontSize: '0.9rem', marginTop: '5px' }}>
                Valid until: {new Date(user.subscription.endDate).toLocaleDateString()}
              </p>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '40px', flexWrap: 'wrap' }}>
            {['videos', 'images', 'facts', 'documentaries'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="btn"
                style={{
                  background: activeTab === tab ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'rgba(255,255,255,0.1)',
                  color: 'white',
                  border: 'none'
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {content && (
            <>
              {activeTab === 'videos' && (
                <div className="grid grid-3">
                  {content.videos.map(video => (
                    <div key={video.id} className="card">
                      <div style={{ 
                        width: '100%', 
                        height: '200px', 
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '10px',
                        marginBottom: '15px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '3rem',
                        position: 'relative',
                        overflow: 'hidden'
                      }}>
                        <img 
                          src={video.thumbnail} 
                          alt={video.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = '<div style="font-size: 3rem;">🎬</div>';
                          }}
                        />
                        <div style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          background: 'rgba(0,0,0,0.7)',
                          borderRadius: '50%',
                          width: '60px',
                          height: '60px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '2rem'
                        }}>
                          ▶
                        </div>
                      </div>
                      <h3 style={{ marginBottom: '10px', color: '#667eea' }}>{video.title}</h3>
                      <p style={{ color: '#d0d0d0', fontSize: '0.9rem' }}>{video.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'images' && (
                <div className="grid grid-3">
                  {content.images.map(image => (
                    <div key={image.id} className="card">
                      <div style={{ 
                        width: '100%', 
                        height: '250px', 
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '10px',
                        marginBottom: '15px',
                        overflow: 'hidden'
                      }}>
                        <img 
                          src={image.url} 
                          alt={image.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; font-size: 3rem;">🖼️</div>';
                          }}
                        />
                      </div>
                      <h3 style={{ marginBottom: '10px', color: '#f093fb' }}>{image.title}</h3>
                      <p style={{ color: '#d0d0d0', fontSize: '0.9rem' }}>{image.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'facts' && (
                <div className="grid grid-2">
                  {content.facts.map(fact => (
                    <div key={fact.id} className="card">
                      <div style={{ fontSize: '3rem', marginBottom: '15px', textAlign: 'center', color: '#f093fb' }}>
                        <GiBlackHoleBolas />
                      </div>
                      <h3 style={{ marginBottom: '15px', color: '#667eea', textAlign: 'center' }}>{fact.title}</h3>
                      <p style={{ color: '#d0d0d0', lineHeight: '1.8', fontSize: '1.1rem' }}>{fact.content}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'documentaries' && (
                <div className="grid grid-2">
                  {content.documentaries.map(doc => (
                    <div key={doc.id} className="card">
                      <div style={{ 
                        width: '100%', 
                        height: '200px', 
                        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                        borderRadius: '10px',
                        marginBottom: '15px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '3rem',
                        position: 'relative',
                        overflow: 'hidden'
                      }}>
                        <img 
                          src={doc.thumbnail} 
                          alt={doc.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = '<div style="font-size: 3rem;">📹</div>';
                          }}
                        />
                        <div style={{
                          position: 'absolute',
                          bottom: '10px',
                          right: '10px',
                          background: 'rgba(0,0,0,0.8)',
                          padding: '5px 10px',
                          borderRadius: '5px',
                          color: 'white',
                          fontSize: '0.9rem'
                        }}>
                          {doc.duration}
                        </div>
                      </div>
                      <h3 style={{ marginBottom: '10px', color: '#f093fb' }}>{doc.title}</h3>
                      <p style={{ color: '#d0d0d0', fontSize: '0.9rem' }}>{doc.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PremiumContent;

