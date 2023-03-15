import React from "react";

import Home from "./page/home";
import { Sepolia } from "@thirdweb-dev/chains";
import { ThirdwebProvider } from "@thirdweb-dev/react";
function App() {
  return (
    <ThirdwebProvider activeChain={Sepolia}>
      <Home></Home>
    </ThirdwebProvider>
  );
}

export default App;
