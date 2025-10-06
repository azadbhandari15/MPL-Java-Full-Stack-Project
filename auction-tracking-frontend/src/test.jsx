import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom'; 

// --- API PLACEHOLDER FUNCTIONS ---
// NOTE: These functions are placeholders and rely on a functional backend API
// running on the same domain with endpoints like '/api/player/random' and '/api/player/status'.

/**
 * Fetches a random player from the backend API.
 * The API is expected to return a player object: { playerId, name, role, basePoint, Points, image }
 */
const fetchRandomPlayer = async () => {
    // Replace '/api/player/random' with your actual API endpoint
    console.log("Attempting to fetch player data from API...");
    
    // In a real application, you would handle the fetch request here:
    // const response = await fetch('/api/player/random'); 
    // if (!response.ok) {
    //     throw new Error("Failed to fetch player data from API.");
    // }
    // return response.json();
    
    throw new Error("API not implemented. Please configure a backend endpoint for '/api/player/random'.");
};

/**
 * Updates the status of a player (SOLD/UNSOLD) on the backend.
 */
const updatePlayerStatus = (playerId, status) => {
    // Replace '/api/player/status' with your actual API endpoint
    console.log(`Attempting to update status for ${playerId} to ${status} via API...`);
    
    // In a real application, you would handle the fetch request here:
    // return fetch('/api/player/status', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ playerId, status })
    // });
    
    return new Promise((_, reject) => {
        setTimeout(() => {
            reject(new Error("API not implemented. Please configure a backend endpoint for player status updates."));
        }, 300);
    });
};
// --- END API PLACEHOLDER FUNCTIONS ---


// --- STYLES (PURE CSS) - INTEGRATED FROM USER INPUT AND ADJUSTED FOR RESPONSIVENESS ---
const styles = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&family=Rubik:ital,wght@0,300..900;1,300..900&family=Saira:ital,wght@0,100..900;1,100..900&display=swap');

body {
    font-family: 'Rubik', sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f9f6ee; /* Light background */
    color: #1b1b1b; /* Dark text for contrast */
}

.app-container {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    min-height: 100vh;
    padding: 20px;
    background-color: #f9f6ee;
}

.content-wrapper {
    width: 100%;
    max-width: 900px; /* Adjusted max width for centered layout */
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
}

/* --- Buttons --- */
.btn {
    font-family: 'Outfit', sans-serif;
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
    color: white; /* Default color, overridden by specific IDs */
}

.btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.btn.selected {
    transform: scale(1.05);
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
}

/* --- Card Layout (Modified for Responsiveness) --- */
.card-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    /* margin-left: 350px; removed for responsiveness */
}

.card-container-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    /* margin-right: 450px; removed for responsiveness */
}

.card-data {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 20px;
    padding: 60px 100px;
    background-color: #fffaf0;
    color: #1b1b1b;
    border-radius: 10px;
    box-shadow: 0.5px 0.5px 1px 1px rgba(0, 0, 0, 0.1);
    max-width: 100%;
    box-sizing: border-box;
}

.player-image {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.player-image img {
    border-radius: 20%;
    width: 200px;
    height: 200px;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.5); 
    object-fit: cover;
}

.image-placeholder {
    width: 200px;
    height: 200px;
    background-color: #e5e7eb;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 48px;
    border-radius: 20%;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.5);
}

.player-content {
    text-align: left;
}

.player-content h2 {
    font-size: 2rem;
    margin: 0;
    color: #1b1b1b;
}

.player-content .position {
    color: #333;
    font-size: 1.1rem;
    margin: 5px 0;
}

.player-content span {
    display: block;
    font-size: 0.9rem;
    color: #555;
}

.auction-amount {
    background-color: #fffaf0;
    margin-top: 20px;
    padding: 15px 30px;
    color: #1b1b1b;
    text-align: center;
    border-radius: 20px;
    margin-bottom: 2px;
    box-shadow: 0.5px 0.5px 1px 1px rgba(0, 0, 0, 0.1);
}

.auction-amount h2 {
    margin: 0;
    font-size: 1.8rem;
    font-family: 'Outfit', sans-serif;
}

.sold-status {
    background-color: #50C878 !important;
    color: white !important;
}

.unsold-status {
    background-color: #FFC72C !important;
    color: #1b1b1b !important;
}

.auction-buttons-container {
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
    max-width: 400px;
    margin: 20px auto 0;
}

.teams {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    font-size: 15px;
    margin-top: 30px;
    /* margin-left: 400px; removed for responsiveness */
    gap: 10px;
    width: 100%;
}

.auction-actions {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-top: 20px;
    /* margin-left: 400px; removed for responsiveness */
    width: 100%;
}

/* --- Team Button Styles (User's input) --- */
#team1 { background-color: #FFC72C; color: #1b1b1b; }
#team1:hover:not(:disabled) { background-color: #FEBE10; }

#team2 { background-color: #50C878; color: #1b1b1b; }
#team2:hover:not(:disabled) { background-color: #00563B; color: #fff; }

#team3 { background-color: #1560bd; }
#team3:hover:not(:disabled) { background-color: #00308F; color: #fff; }

#team4 { background-color: #0070BB; }
#team4:hover:not(:disabled) { background-color: #1F305E; color: #fff; }

#team5 { background-color: #778899; color: #1b1b1b; }
#team5:hover:not(:disabled) { background-color: #A9A9A9; color: #fff; }

#team6 { background-color: #CD5C5C; }
#team6:hover:not(:disabled) { background-color: #B22222; }

/* Sold/Unsold Buttons (User's input) */
#sold { background-color: #50C878; }
#sold:hover:not(:disabled) { background-color: #18453B; }

#unsold { background-color: #FFC72C; color: #1b1b1b; }
#unsold:hover:not(:disabled) { background-color: #FEBE10; }

/* Bid Entry Button */
.bid-entry-btn {
    background-color: #1560bd; /* Matching team 3 color for main action */
    color: white;
    padding: 15px 30px;
    font-size: 1.2rem;
    width: 100%;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.bid-entry-btn:hover:not(:disabled) {
    background-color: #00308F;
}

/* --- Purse Display (Adjusted for light theme) --- */
.team-purses-display {
    padding: 10px 0;
    border-top: 1px solid #ccc;
    margin-top: 10px;
    width: 100%;
}

.purse-header {
    margin-bottom: 10px;
    font-size: 16px;
    font-weight: bold;
    color: #1b1b1b;
    text-align: center;
}

.purse-list {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
}

.purse-item {
    padding: 6px 10px;
    background-color: #e5e7eb; /* Light grey background */
    border-radius: 8px;
    font-size: 12px;
    color: #1b1b1b;
    transition: background-color 0.2s;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.purse-item.selected-bidder {
    background-color: #FFC72C; /* Highlight the last bidder */
    font-weight: bold;
}

.reset-btn {
    padding: 6px 10px;
    font-size: 12px;
    background-color: #CD5C5C;
    color: #fff;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.reset-btn:hover:not(:disabled) {
    background-color: #B22222;
}

.reset-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* --- Loader and Error States (User's input) --- */
.loading-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #1e3a8a 0%, #7e22ce 50%, #4338ca 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Rubik', sans-serif;
    width: 100%;
}

.loading-content {
    text-align: center;
}

.spinner {
    width: 64px;
    height: 64px;
    border: 4px solid white;
    border-top: 4px solid transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 20px;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.loading-text {
    color: white;
    font-size: 20px;
    font-weight: 600;
}

.error-container {
    min-height: 100vh;
    background-color: #f9f6ee;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    width: 100%;
}

.error-card {
    background-color: #fffaf0;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    padding: 30px;
    max-width: 400px;
    text-align: center;
    color: #1b1b1b;
}

.error-message {
    margin-top: 20px;
    color: #dc2626;
    font-size: 14px;
}

.retry-button {
    display: block;
    margin: 10px auto 0;
    background: #1560bd;
    color: white;
    padding: 10px 20px;
    border-radius: 8px;
    border: none;
    font-weight: 600;
    cursor: pointer;
    font-family: 'Outfit', sans-serif;
    transition: all 0.3s ease;
}

.retry-button:hover {
    background: #00308F;
    transform: scale(1.05);
}

/* --- Modal Styles (Adjusted for light theme) --- */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background-color: #fffaf0;
    border-radius: 15px;
    padding: 30px;
    width: 90%;
    max-width: 450px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    color: #1b1b1b;
    animation: fadeIn 0.3s ease-out;
}

.modal-title {
    font-size: 1.5rem;
    margin-bottom: 20px;
    color: #1560bd;
    text-align: center;
}

.form-group {
    margin-bottom: 15px;
}

.form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
    color: #333;
}

.form-group input, .form-group select {
    width: 100%;
    padding: 10px;
    border-radius: 8px;
    border: 1px solid #ccc;
    background-color: #ffffff;
    color: #1b1b1b;
    box-sizing: border-box;
    font-size: 1rem;
}

.form-group input:focus, .form-group select:focus {
    outline: none;
    border-color: #1560bd;
}

.modal-bid-info {
    font-size: 0.9rem;
    color: #555;
    margin-top: 5px;
}

.modal-actions {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
}

.modal-btn {
    padding: 10px 20px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    transition: background-color 0.2s;
    font-family: 'Outfit', sans-serif;
}

.modal-btn.primary {
    background-color: #50C878;
    color: white;
}

.modal-btn.primary:hover:not(:disabled) {
    background-color: #18453B;
}

.modal-btn.secondary {
    background-color: #778899;
    color: white;
}

.modal-btn.secondary:hover {
    background-color: #A9A9A9;
}

.modal-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* --- Notification/Message Box (Adjusted for light theme) --- */
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: #FFC72C; /* Yellow accent */
    color: #1b1b1b;
    padding: 15px 25px;
    border-radius: 10px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    font-weight: bold;
    z-index: 1001;
    animation: slideIn 0.5s ease-out, fadeOut 0.5s ease-in 2.5s forwards;
}

@keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}

@keyframes fadeOut {
    to { opacity: 0; visibility: hidden; }
}

/* --- Responsive Adjustments --- */
@media (max-width: 768px) {
    .card-data {
        padding: 30px 40px;
        flex-direction: column;
        text-align: center;
    }
    .player-image {
        margin-bottom: 15px;
    }
    .player-image img {
        width: 150px;
        height: 150px;
    }
    .image-placeholder {
        width: 150px;
        height: 150px;
    }
    .auction-amount h2 {
        font-size: 1.5rem;
    }
    .teams {
        flex-direction: column;
        gap: 5px;
    }
    .auction-actions {
        flex-direction: column;
    }
    .auction-actions .btn {
        width: 100%;
    }
    .purse-item {
        font-size: 10px;
        padding: 4px 8px;
    }
}
`;

// Define the initial default purses
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

// Function to read from localStorage or return default purses
const getInitialPurses = () => {
    const savedPurses = localStorage.getItem('teamPurses');
    if (savedPurses) {
        try {
            return JSON.parse(savedPurses);
        } catch (e) {
            console.error("Could not parse saved purses, using default.", e);
            return DEFAULT_PURSES;
        }
    }
    return DEFAULT_PURSES;
};

// Bid Append Logic
function appendBid(points) {
    if (points >= 75 && points < 100) return 25;
    if (points >= 100 && points < 2000) return 50;
    return 100;
}

function App() {
    // Current bid is initialized to the absolute minimum base price since no player is loaded yet
    const [currentBid, setCurrentBid] = useState(75); 
    const [selectedTeam, setSelectedTeam] = useState("");
    const [auctionStatus, setAuctionStatus] = useState("active");
    const [soldTo, setSoldTo] = useState(null);
    const [soldBid, setSoldBid] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [player, setPlayer] = useState(null);
    const [imageLoading, setImageLoading] = useState(true);
    const [imageError, setImageError] = useState(false);
    const [teamPurses, setTeamPurses] = useState(getInitialPurses);
    
    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalError, setModalError] = useState('');
    const [notification, setNotification] = useState(null);

    // Effect: Save teamPurses to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('teamPurses', JSON.stringify(teamPurses));
    }, [teamPurses]);

    // Effect: Clear notification after a delay
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    // Check if a team can afford a given bid amount
    const canTeamAfford = (teamName, bidAmount) => {
        const remainingPurse = teamPurses[teamName];
        return remainingPurse >= bidAmount;
    }

    // Function to show a temporary notification
    const showNotification = (message) => {
        setNotification(message);
    }

    // Use the placeholder API function
    const fetchPlayerData = useCallback(async () => {
        console.log("Fetching player data...");
        setLoading(true);
        setError(null);
        setImageLoading(true);
        setImageError(false);
        try {
            const data = await fetchRandomPlayer();
            
            setPlayer(data);
            // Use Player Points, Base Points, or a fallback value (75)
            setCurrentBid(data.Points || data.basePoint || 75); 
        } catch (error) {
            // If the API fails, clear the player data and set an error
            setPlayer(null); 
            setError(error.message || 'Failed to connect to the player API.');
            console.error('Error fetching player data:', error);
            setCurrentBid(75);
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

    const handleOpenModal = () => {
        if (auctionStatus !== 'active' || loading || !player) return;
        setModalError('');
        setIsModalOpen(true);
    };

    const handlePlaceBid = (teamName, bidAmount) => {
        if (!player) return;

        setModalError('');
        const bid = parseInt(bidAmount, 10);

        if (isNaN(bid) || bid < 0) {
            setModalError('Please enter a valid bid amount.');
            return;
        }

        const basePoint = player.Points || player.basePoint || 75;

        // Calculate minimum required bid
        let requiredMinBid = basePoint;
        if (selectedTeam) {
            // If bidding has started, minimum bid is current bid + increment
            requiredMinBid = currentBid + appendBid(currentBid);
        } else {
            // If no bid yet, minimum is the base price
            requiredMinBid = basePoint;
        }


        if (bid < requiredMinBid) {
            setModalError(`The next bid must be at least ${requiredMinBid}.`);
            return;
        }

        if (teamName === selectedTeam && bid === currentBid) {
            showNotification(`Bid of ${bid} already placed by ${teamName}.`);
            setIsModalOpen(false);
            return;
        }

        if (!canTeamAfford(teamName, bid)) {
            setModalError(`${teamName} cannot afford a bid of ${bid}. Remaining purse: ${teamPurses[teamName]}`);
            return;
        }

        // --- SUCCESSFUL BID UPDATE ---
        setCurrentBid(bid);
        setSelectedTeam(teamName);
        showNotification(`${teamName} bids ${bid}!`);
        setIsModalOpen(false);
    };

    const handleSold = async () => {
        if (!selectedTeam || !player) {
            showNotification("Please place a bid before marking as sold.");
            return;
        }
        setLoading(true);

        try {
            // 1. Update the team's purse locally immediately
            setTeamPurses(prevPurses => ({
                ...prevPurses,
                [selectedTeam]: prevPurses[selectedTeam] - currentBid
            }));
            
            // 2. Use placeholder update function
            await updatePlayerStatus(player.playerId || player.id, 'SOLD');

            // 3. Update UI to SOLD state
            setAuctionStatus('sold');
            setSoldTo(selectedTeam);
            setSoldBid(currentBid);
            showNotification(`${player.name} SOLD to ${selectedTeam} for ${currentBid}!`);

            // 4. Transition to next player after a delay
            setTimeout(() => {
                fetchPlayerData();
                setSelectedTeam("");
                setAuctionStatus('active');
                setSoldTo(null);
                setSoldBid(0);
            }, 2000);

        } catch (error) {
            setError(error.message || 'Failed to complete transaction.'); 
            console.error('Error handling sold action:', error);
            setLoading(false);
            // Optionally, revert purse change if the API explicitly confirms failure
            // (not implemented here for simplicity, assuming API success for mock flow)
        }
    };

    const handlePass = async () => {
        if (!player) return;
        setLoading(true);
        try {
            // Use placeholder update function
            await updatePlayerStatus(player.playerId || player.id, 'UNSOLD');

            // Update UI to UNSOLD state
            setAuctionStatus('unsold');
            showNotification(`${player.name} UNSOLD.`);
            
            // Transition to next player after a delay
            setTimeout(() => {
                fetchPlayerData();
                setSelectedTeam("");
                setAuctionStatus('active');
            }, 2000);

        } catch (error) {
            setError(error.message || 'Failed to complete pass transaction.'); 
            console.error('Error handling pass action:', error);
            setLoading(false);
        }
    };

    const resetPurses = () => {
        localStorage.removeItem('teamPurses');
        setTeamPurses(DEFAULT_PURSES);
        showNotification('Team purses have been reset to 10000 each.');
    };
    
    // --- RENDER FUNCTIONS ---

    const BidModal = ({ isOpen, onClose, currentBid, selectedTeam, player }) => {
        if (!player) return null; // Safety check

        // Initial state for the modal form
        const [modalTeam, setModalTeam] = useState(selectedTeam || teams[0].name);
        
        // Calculate min initial bid correctly
        const basePoint = player.Points || player.basePoint || 75;
        const nextBidIncrement = appendBid(currentBid);
        const minNextBid = selectedTeam ? currentBid + nextBidIncrement : basePoint;

        const [bidAmount, setBidAmount] = useState(minNextBid.toString());

        useEffect(() => {
            if (isOpen && player) {
                // Recalculate minimum bid when opening the modal
                const newBasePoint = player.Points || player.basePoint || 75;
                const newNextIncrement = appendBid(currentBid);
                const newMinNextBid = selectedTeam ? currentBid + newNextIncrement : newBasePoint;

                setBidAmount(newMinNextBid.toString());
                setModalTeam(selectedTeam || teams[0].name);
                setModalError('');
            }
        }, [isOpen, currentBid, selectedTeam, player]);


        if (!isOpen) return null;

        const handleSubmit = (e) => {
            e.preventDefault();
            handlePlaceBid(modalTeam, bidAmount);
        };
        
        // This is a minimal way to implement a modal in a single file React environment
        return createPortal(
            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-content" onClick={e => e.stopPropagation()}>
                    <form onSubmit={handleSubmit}>
                        <h3 className="modal-title">Place Your Bid for {player.name}</h3>

                        <div className="form-group">
                            <label htmlFor="team-select">Bidding Team</label>
                            <select 
                                id="team-select"
                                value={modalTeam}
                                onChange={(e) => {
                                    setModalTeam(e.target.value);
                                    setModalError('');
                                }}
                            >
                                {teams.map(team => (
                                    <option key={team.id} value={team.name}>
                                        {team.name} (Purse: {teamPurses[team.name]})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="bid-amount">Bid Amount</label>
                            <input
                                id="bid-amount"
                                type="number"
                                value={bidAmount}
                                onChange={(e) => {
                                    setBidAmount(e.target.value);
                                    setModalError('');
                                }}
                                min={minNextBid}
                                step={nextBidIncrement}
                                required
                            />
                            <p className="modal-bid-info">
                                Min required bid: **{minNextBid}**.
                                Current high bid: {selectedTeam ? `${currentBid} by ${selectedTeam}` : 'N/A'}.
                                Next increment: {nextBidIncrement}.
                            </p>
                            
                            {modalError && (
                                <p style={{ color: '#CD5C5C', marginTop: '10px', fontWeight: 'bold' }}>
                                    Error: {modalError}
                                </p>
                            )}
                        </div>

                        <div className="modal-actions">
                            <button type="button" onClick={onClose} className="modal-btn secondary">
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                className="modal-btn primary"
                                disabled={!canTeamAfford(modalTeam, parseInt(bidAmount, 10)) || parseInt(bidAmount, 10) < minNextBid}
                            >
                                Place Bid
                            </button>
                        </div>
                    </form>
                </div>
            </div>,
            document.body // Portal target
        );
    };

    // --- MAIN RENDER ---

    // Initial loading or error state when player is null
    if (loading && !player) {
        return (
            <div className="loading-container">
                <style>{styles}</style>
                <div className="loading-content">
                    <div className="spinner"></div>
                    <p className="loading-text">
                        {error ? `API Error: ${error}` : 'Loading Auction...'}
                    </p>
                    {error && (
                        <button onClick={fetchPlayerData} className="retry-button">Retry Loading</button>
                    )}
                </div>
            </div>
        );
    }

    if (!player) return null; // Should only happen briefly if API fetch fails after initial load

    // Determine the auction amount class for styling
    let auctionStatusClass = '';
    if (auctionStatus === 'sold') {
        auctionStatusClass = 'sold-status';
    } else if (auctionStatus === 'unsold') {
        auctionStatusClass = 'unsold-status';
    }

    const currentDisplayBid = selectedTeam 
        ? `Current Bid: ${currentBid} by ${selectedTeam}`
        : `Base Price: ${player.Points || player.basePoint || 75}`;
        
    const finalDisplayBid = auctionStatus === "sold" 
        ? `Sold to ${soldTo} for ${soldBid}`
        : auctionStatus === "unsold"
        ? `Unsold`
        : currentDisplayBid;


    return (
        <div className="app-container">
            <style>{styles}</style>
            
            {notification && (
                <div className="notification">{notification}</div>
            )}

            <div className="content-wrapper">
                
                {/* PURSE DISPLAY */}
                <div className="team-purses-display">
                    <h3 className="purse-header">Remaining Purses 💰</h3>
                    <div className="purse-list">
                        {teams.map(team => (
                            <span 
                                key={team.id} 
                                className={`purse-item ${team.name === selectedTeam ? 'selected-bidder' : ''}`}
                            >
                                {team.name}: **{teamPurses[team.name]}**
                            </span>
                        ))}
                        <button onClick={resetPurses} disabled={loading} className="reset-btn">
                            Reset Purses
                        </button>
                    </div>
                </div>

                <div className="card-container-box">
                    <div className="card-container">
                        
                        {/* Player Card */}
                        <div className="card-data">
                            <div className="player-image">
                                {/* Loading spinner for image: Using pure CSS spinner fallback */}
                                {imageLoading && (
                                    <div className="spinner" style={{ position: 'absolute' }}></div>
                                )}

                                {/* Error placeholder */}
                                {imageError && (
                                    <div className="image-placeholder">👤</div>
                                )}

                                {/* Image with key prop to force re-render */}
                                <img 
                                    key={player.playerId || player.id || player.image}
                                    src={player.image}  
                                    alt="player profile"
                                    onLoad={handleImageLoad}
                                    onError={handleImageError}
                                    style={{ 
                                        display: imageLoading || imageError ? 'none' : 'block',
                                        objectFit: 'cover'
                                    }}
                                />
                            </div>
                            <div className="player-content">
                                <h2>{player.name}</h2>
                                <p className="position">{player.role}</p>
                                <span>Base Points: {player.Points || player.basePoint || 75}</span>
                            </div>
                        </div>
                        
                        {/* Auction Status */}
                        <div className="auction-amount">
                            <h2 id="data" className={auctionStatusClass}>{finalDisplayBid}</h2>
                        </div>
                    </div>
                    
                    {/* Auction Actions and Bid Button */}
                    <div className="auction-buttons-container">
                        <button 
                            className="btn bid-entry-btn" 
                            onClick={handleOpenModal}
                            disabled={auctionStatus !== 'active' || loading || !player}
                        >
                            Place New Bid
                        </button>

                        <div className="auction-actions">
                            <button 
                                id="sold" 
                                onClick={handleSold} 
                                className="btn"
                                disabled={auctionStatus !== 'active' || loading || !selectedTeam || !player}
                            >
                                Sold
                            </button>
                            <button 
                                id="unsold" 
                                className="btn" 
                                onClick={handlePass}
                                disabled={auctionStatus !== 'active' || loading || !player}
                            >
                                Pass
                            </button>
                        </div> 
                    </div>
                </div>
            </div>
            
            {/* Modal is rendered here */}
            {player && (
                <BidModal 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)} 
                    currentBid={currentBid}
                    selectedTeam={selectedTeam}
                    player={player}
                />
            )}
        </div>
    );
}

export default App;
