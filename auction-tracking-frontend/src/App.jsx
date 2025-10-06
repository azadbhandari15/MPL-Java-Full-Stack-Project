import { useState, useEffect, useCallback } from 'react'
import { RotatingLines } from 'react-loader-spinner';
import './App.css'
import './tailwind.css'

// Define the initial default purses outside the component
const DEFAULT_PURSES = {
  'Champion Strikers': 10000,
  'Mission XI': 10000,
  'McDonalds XI': 10000,
  'Shaktipeeth XI': 10000,
  'Royal Devilzz': 10000,
  'AdiShakti XI': 10000
};

const teams = [
    { id: 'team1', name: 'Champion Strikers' },
    { id: 'team2', name: 'Mission XI' },
    { id: 'team3', name: 'McDonalds XI' },
    { id: 'team4', name: 'Shaktipeeth XI' },
    { id: 'team5', name: 'Royal Devilzz' },
    { id: 'team6', name: 'AdiShakti XI' }
  ];

  let firstBid=true;

// Function to read from localStorage or return default purses
const getInitialPurses = () => {
  const savedPurses = localStorage.getItem('teamPurses');
  if (savedPurses) {
    // Attempt to parse and return saved data
    try {
      return JSON.parse(savedPurses);
    } catch (e) {
      console.error("Could not parse saved purses, using default.", e);
      return DEFAULT_PURSES;
    }
  }
  // Otherwise, return the default starting amounts
  return DEFAULT_PURSES;
};

function App() {
  const [currentBid, setCurrentBid] = useState(100);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [auctionStatus, setAuctionStatus] = useState("active");
  const [soldTo, setSoldTo] = useState(null);
  const [soldBid, setSoldBid] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [player, setPlayer] = useState(null);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  
  // ✅ PERSISTED STATE: Initialize state by reading from localStorage
  const [teamPurses, setTeamPurses] = useState(getInitialPurses);

  // ✅ EFFECT: Save teamPurses to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('teamPurses', JSON.stringify(teamPurses));
  }, [teamPurses]);

  const fetchPlayerData = useCallback(async () => {
    console.log("Fetching player data...");
    setLoading(true);
    setError(null);
    setImageLoading(true);
    setImageError(false);
    try {
      const response = await fetch('http://localhost:8080/findRandomPlayer');
      console.log("Response:", response);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log("Player data received:", data);
      await new Promise(resolve => setTimeout(resolve, 500));
      setPlayer(data);
      setCurrentBid(data.Points || data.basePoint || 75); 
    } catch (error) {
      setError(error.message);
      console.error('Error fetching player data:', error);
      // Fallback data for testing/error handling
      setPlayer({
        id: 'fallBack1',
        name: 'Sam Ashrafi',
        role: 'All Rounder',
        basePoint: 100,
        Points: 100,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpfudoYuJ-JyJFKKHUYkotdRWHXZvQj2bfHw&s'
      });
      setCurrentBid(100);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlayerData();
  }, [fetchPlayerData]);

  // Reset image loading when player changes
  useEffect(() => {
    if (player) {
      setImageLoading(true);
      setImageError(false);
    }
  }, [player?.id, player?.image]);

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  function appendBid(points) {
    if (points >= 75 && points < 100) {
      return 25;
    }
    if (points >= 100 && points < 2000) {
      return 50;
    }
    return 100;
  }

  // Check if a team can afford the next bid
  const canTeamBid = (teamName) => {
    const nextBid = currentBid + appendBid(currentBid);
    const remainingPurse = teamPurses[teamName];
    return remainingPurse >= nextBid;
  }

  const handleTeamBid = (teamName) => {
    setSelectedTeam(teamName);
    if(firstBid){
      firstBid=false;
      return;
    }
    let append = appendBid(currentBid);
    setCurrentBid(prev => prev + append);
  };

  const handleSold = async () => {
    if (!selectedTeam) {
      alert("Please select a team before marking as sold.");
      return;
    }
    setLoading(true);

    try {
      // 1. Update the team's purse locally immediately
      setTeamPurses(prevPurses => ({
        ...prevPurses,
        [selectedTeam]: prevPurses[selectedTeam] - currentBid
      }));
      setCurrentBid(currentBid);
      
      // 2. Send update to the server
      const updatedResponse = await fetch('http://localhost:8080/sell-player', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin':'*'
        },
        body: JSON.stringify({
          playerId: player.playerId || player.id, 
          selectedTeam: selectedTeam,
          soldAmount: currentBid,
          auctionStatus: 'SOLD',
        }),
      });
      

      if (!updatedResponse.ok) {
        throw new Error('Failed to update player status');
      }

      // 3. Fetch next player
      const nextPlayerResponse = await fetch('http://localhost:8080/findRandomPlayer');
      firstBid=true
      await new Promise(resolve => setTimeout(resolve, 500));
      if (!nextPlayerResponse.ok) {
        throw new Error('Failed to fetch next player');
      }
      const nextPlayerData = await nextPlayerResponse.json();
      
      // 4. Update UI to SOLD state
      setAuctionStatus('sold');
      setSoldTo(selectedTeam);
      setSoldBid(currentBid);

      // 5. Transition to next player after a delay, and re-enable buttons
      setTimeout(() => {
        setPlayer(nextPlayerData);
        setCurrentBid(nextPlayerData.Points || nextPlayerData.basePoint || 75);
        setSelectedTeam("");
        setAuctionStatus('active'); // ✅ RE-ENABLE BUTTONS FOR NEXT AUCTION
        setSoldTo(null);
        setSoldBid(0);
        setLoading(false); // ✅ IMPORTANT: End loading state
      }, 2000);

    } catch (error) {
      setError(error.message);  
      console.error('Error handling sold action:', error);
    }
  };

  const handlePass = async () => {
    setLoading(true);
    try {
      const updatedResponse = await fetch('http://localhost:8080/sell-player', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playerId: player.playerId || player.id,
          auctionStatus: 'UNSOLD',
        }),
      });

      if (!updatedResponse.ok) {
        throw new Error('Failed to update player status');
      }

      const nextPlayerResponse = await fetch('http://localhost:8080/findRandomPlayer');
      if (!nextPlayerResponse.ok) {
        throw new Error('Failed to fetch next player');
      }
      const nextPlayerData = await nextPlayerResponse.json();
      
      setAuctionStatus('unsold');
      
      setTimeout(() => {
        setPlayer(nextPlayerData);
        setCurrentBid(nextPlayerData.Points || nextPlayerData.basePoint || 75);
        setSelectedTeam("");
        setAuctionStatus('active'); // ✅ RE-ENABLE BUTTONS FOR NEXT AUCTION
        setLoading(false); // ✅ IMPORTANT: End loading state
      }, 2000);

    } catch (error) {
      setError(error.message);  
      console.error('Error handling pass action:', error);
    }
  };

  const resetPurses = () => {
    localStorage.removeItem('teamPurses'); // Clear saved data
    setTeamPurses(DEFAULT_PURSES); // Set state back to defaults
    alert('Team purses have been reset to default values (5000, 4500, etc.).');
  };
  
  // --- UI RENDER LOGIC ---

  if (loading && !player) {
    return (
      <div className="rotating-lines-container">
    <RotatingLines
      strokeColor="black"
      strokeWidth="5"
      animationDuration="0.75"
      width="96"
      visible={true}
    />
  </div>
    );
  }

  if (error && !player) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md text-center">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Error Loading Player Details...</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button onClick={fetchPlayerData} className="bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-all">Retry</button>
        </div>
      </div>
    );
  }

  if (!player) return null;

  return (
    <>
      <div className="container">
        <div className="card-container-box">
          <div className="card-container">
            <div className="card-data">
              <div className="player-image" style={{ position: 'relative' }}>
                {/* Loading spinner for image */}
                {imageLoading && (
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 10
                  }}>
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}

                {/* Error placeholder */}
                {imageError && (
                  <div style={{
                    width: '200px',
                    height: '200px',
                    backgroundColor: '#e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '48px',
                    borderRadius: '20%',
                  }}>
                    👤
                  </div>
                )}

                {/* Image with key prop to force re-render */}
                {!imageError && (
                  <img 
                    key={player.playerId || player.id || player.image}
                    src={player.image}  
                    alt="player profile"
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    style={{ 
                      display: imageLoading ? 'none' : 'block',
                      objectFit: 'cover'
                    }}
                  />
                )}
              </div>
              <div className="player-content">
                <h2>{player.name}</h2>
                <h3>Player Number: {player.id}</h3>
                <p className="position">{player.role}</p>
                <span>Base Points: {player.Points || player.basePoint}</span>
              </div>
            </div>
            
            <div className="auction-amount">
              {!selectedTeam && <h2 id="data">Base Points: {player.Points || player.basePoint}</h2>}
              {selectedTeam && auctionStatus === "active" && <h2 id="data">Current Bid: {currentBid} by {selectedTeam}</h2>}
              {auctionStatus === "sold" && <h2 id="data">Sold to {soldTo} for {soldBid}</h2>}
              {auctionStatus === "unsold" && <h2 id="data">Unsold</h2>}
            </div>

            {/* PURSE DISPLAY */}
            <div className="team-purses-display" style={{ marginTop: '10px', padding: '10px', borderTop: '1px solid #ccc' }}>
              <h3 style={{ marginBottom: '5px', fontSize: '14px', fontWeight: 'bold',color:'#000' }}>Remaining Purses 💰</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {teams.map(team => (
                  <span key={team.id} style={{ padding: '4px 8px', backgroundColor: team.name === selectedTeam ? '#3CB371' : '#32CD32', borderRadius: '5px', fontSize: '12px', border: team.name === selectedTeam ? '1px solid #00bcd4' : 'none' }}>
                    {team.name}: **{teamPurses[team.name]}**
                  </span>
                ))}
                <button onClick={resetPurses} disabled={loading} style={{ 
                    padding: '4px 8px', 
                    fontSize: '12px', 
                    backgroundColor: '#ffcdd2', 
                    color: '#c62828',
                    border: '1px solid #c62828',
                    borderRadius: '5px',
                    cursor: loading ? 'not-allowed' : 'pointer'
                  }}>
                  Reset Purses
                </button>
              </div>
            </div>

          </div>
          <div className="auction-buttons-container">
            <div className="teams">
              {teams.map(team => {
                // Check for disabling conditions
                const isCurrentBidder = selectedTeam === team.name;
                const canAffordNextBid = canTeamBid(team.name);
                const isDisabled = auctionStatus !== 'active' || loading || isCurrentBidder || !canAffordNextBid;

                return (
                  <button 
                    key={team.id} 
                    id={team.id} 
                    className={`btn ${selectedTeam === team.name ? 'selected' : ''}`} 
                    onClick={() => handleTeamBid(team.name)}
                    disabled={isDisabled}
                    title={
                      isCurrentBidder ? `You are the current bidder (Bid: ${currentBid}).` :
                      !canAffordNextBid ? `Next bid (${currentBid + appendBid(currentBid)}) exceeds remaining purse (${teamPurses[team.name]}).` :
                      auctionStatus !== 'active' || loading ? 'Auction is not active or loading.' : ''
                    }
                  >
                    {team.name}
                  </button>
                );
              })}
            </div>
            <div className="auction-actions">
              <button 
                id="sold" 
                onClick={handleSold} 
                className="btn"
                disabled={auctionStatus !== 'active' || loading}
              >
                Sold
              </button>
              <button 
                id="unsold" 
                className="btn" 
                onClick={handlePass}
                disabled={auctionStatus !== 'active' || loading}
              >
                Pass
              </button>
             
            </div> 
          </div>
        </div>
      </div>
    </>
  );
}

export default App;