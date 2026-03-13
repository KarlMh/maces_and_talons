export default function SettingsScreen({ onClose }) {
  return (
    <div style={{ 
      position: 'fixed', 
      inset: 0, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      zIndex: 100, 
      background: 'rgba(0,0,0,0.85)', 
      backdropFilter: 'blur(4px)',
      animation: 'fade-in 0.3s ease-out forwards',
    }}>
      <div style={{ 
        background: 'linear-gradient(135deg, #d4b896 0%, #c8a870 50%, #a07840 100%)',
        border: '4px solid #3d2a10',
        borderRadius: 12, 
        padding: '40px 48px', 
        maxWidth: 500,
        maxHeight: '80vh',
        overflowY: 'auto',
        boxShadow: '0 16px 48px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.2)',
      }}>
        {/* Header */}
        <div style={{ 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
        }}>
          <h2 style={{ 
            fontFamily: "'Cinzel Decorative', serif",
            fontSize: '1.6rem',
            color: '#3a2000',
            margin: 0,
            letterSpacing: '0.1em',
          }}>
            ⚙️ Settings
          </h2>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#5a3d1a',
              padding: 0,
            }}
          >
            ✕
          </button>
        </div>

        {/* Settings sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          {/* Sound */}
          <div>
            <label style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              cursor: 'pointer',
              fontFamily: "'IM Fell English', serif",
              color: '#3a2000',
              fontSize: '1rem',
            }}>
              <input 
                type="checkbox" 
                defaultChecked={true}
                style={{ width: 16, height: 16, cursor: 'pointer' }}
              />
              <span>🔊 Sound Effects</span>
            </label>
          </div>

          {/* Music */}
          <div>
            <label style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              cursor: 'pointer',
              fontFamily: "'IM Fell English', serif",
              color: '#3a2000',
              fontSize: '1rem',
            }}>
              <input 
                type="checkbox" 
                defaultChecked={true}
                style={{ width: 16, height: 16, cursor: 'pointer' }}
              />
              <span>🎵 Background Music</span>
            </label>
          </div>

          {/* Animation Speed */}
          <div>
            <label style={{ 
              display: 'block',
              fontFamily: "'IM Fell English', serif",
              color: '#3a2000',
              fontSize: '0.95rem',
              marginBottom: 8,
            }}>
              Animation Speed
            </label>
            <select style={{
              width: '100%',
              padding: '8px 12px',
              border: '2px solid #5a3d1a',
              borderRadius: 4,
              background: 'rgba(255,255,255,0.9)',
              color: '#3a2000',
              fontFamily: "'IM Fell English', serif",
              fontSize: '0.9rem',
              cursor: 'pointer',
            }}>
              <option>Normal</option>
              <option>Fast</option>
              <option>Slow</option>
            </select>
          </div>

          {/* Difficulty */}
          <div>
            <label style={{ 
              display: 'block',
              fontFamily: "'IM Fell English', serif",
              color: '#3a2000',
              fontSize: '0.95rem',
              marginBottom: 8,
            }}>
              AI Difficulty
            </label>
            <select style={{
              width: '100%',
              padding: '8px 12px',
              border: '2px solid #5a3d1a',
              borderRadius: 4,
              background: 'rgba(255,255,255,0.9)',
              color: '#3a2000',
              fontFamily: "'IM Fell English', serif",
              fontSize: '0.9rem',
              cursor: 'pointer',
            }}>
              <option>Easy</option>
              <option>Normal</option>
              <option>Hard</option>
              <option>Legendary</option>
            </select>
          </div>

          {/* Accessibility */}
          <div style={{ 
            borderTop: '2px solid rgba(90,61,26,0.3)',
            paddingTop: 16,
          }}>
            <h3 style={{ 
              fontFamily: "'IM Fell English', serif",
              fontSize: '1rem',
              color: '#3a2000',
              marginBottom: 12,
            }}>
              ♿ Accessibility
            </h3>
            <label style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              cursor: 'pointer',
              fontFamily: "'IM Fell English', serif",
              color: '#3a2000',
              fontSize: '0.9rem',
              marginBottom: 10,
            }}>
              <input 
                type="checkbox"
                style={{ width: 16, height: 16, cursor: 'pointer' }}
              />
              <span>High Contrast Mode</span>
            </label>
            <label style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              cursor: 'pointer',
              fontFamily: "'IM Fell English', serif",
              color: '#3a2000',
              fontSize: '0.9rem',
            }}>
              <input 
                type="checkbox"
                style={{ width: 16, height: 16, cursor: 'pointer' }}
              />
              <span>Larger Text</span>
            </label>
          </div>
        </div>

        {/* Close button */}
        <button 
          onClick={onClose}
          style={{
            width: '100%',
            padding: '12px 20px',
            marginTop: 28,
            background: 'linear-gradient(180deg, #8b6914 0%, #5a3d10 100%)',
            border: '2px solid #3a2800',
            borderRadius: 6,
            color: '#e8c060',
            fontFamily: "'Cinzel Decorative', serif",
            fontSize: '0.9rem',
            fontWeight: 600,
            cursor: 'pointer',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.background = 'linear-gradient(180deg, #a07a1a 0%, #6b4a18 100%)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.background = 'linear-gradient(180deg, #8b6914 0%, #5a3d10 100%)';
          }}
        >
          Done
        </button>
      </div>
    </div>
  );
}
