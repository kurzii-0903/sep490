import React from "react";
import UserRouter from "./routers/UserRouter";
function App({ config }) {
    return (
        <div className="App">
            <UserRouter config={config} />
        </div>
    );
}

export default App;
