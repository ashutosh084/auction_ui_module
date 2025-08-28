import api from "../utils/api";

const Header = ({ onLogout }) => {

    const onLogoutClick = () => {
        onLogout?.();
        api.post("/logout").catch((err) => {
            console.error("Logout failed:", err);
        });
    }

    return (
        <div className="app-header">
            <h1>Item Auction</h1>
            <button onClick={onLogoutClick} className="logout-button">
                Logout
            </button>
        </div>
    );
}

export default Header;
