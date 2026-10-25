import React from "react";
import "./App.css";

function App() {
  const [showLogin, setShowLogin] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [balance, setBalance] = React.useState(null);
  const [isLoggedIn, setIsLoggedIn] = React.useState(
    Boolean(localStorage.getItem("token")),
  );
  const [showRegister, setShowRegister] = React.useState(false);
  const [name, setName] = React.useState("");
  const [registerEmail, setRegisterEmail] = React.useState("");
  const [registerPassword, setRegisterPassword] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [depositAmount, setDepositAmount] = React.useState("");
  const [withdrawAmount, setWithdrawAmount] = React.useState("");
  const [transactions, setTransactions] = React.useState([]);
  const [recipientAccountId, setRecipientAccountId] = React.useState("");
  const [transferAmount, setTransferAmount] = React.useState("");
  const [accountId, setAccountId] = React.useState(null);
  const [isDepositing, setIsDepositing] = React.useState(false);
  const [isWithdrawing, setIsWithdrawing] = React.useState(false);
  const [isTransferring, setIsTransferring] = React.useState(false);

  React.useEffect(() => {
    if (localStorage.getItem("token")) {
      fetchBalance();
      fetchTransactions();
    }
  }, []);

  async function handleLogin() {
    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message || data.error || "Login failed. Please try again.",
        );
        return;
      }

      localStorage.setItem("token", data.token);
      setIsLoggedIn(true);
      setShowLogin(false);
      setMessage("Welcome, " + data.name + "!");
      await fetchBalance();
      await fetchTransactions();
    } catch {
      setMessage("Unable to connect to the server. Please try again.");
    }
  }

  async function handleRegister() {
    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email: registerEmail,
          password: registerPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            data.error ||
            "Registration failed. Please try again.",
        );
        return;
      }

      setMessage("Registration successful! Welcome, " + data.name);
      setShowRegister(false);
      setShowLogin(true);
      setName("");
      setRegisterEmail("");
      setRegisterPassword("");
    } catch {
      setMessage("Unable to connect to the server. Please try again.");
    }
  }

  async function fetchBalance() {
    try {
      const response = await fetch("http://localhost:8080/api/accounts/me", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      if (response.status === 401) {
        handleLogout();
        setMessage("Session expired. Please log in again.");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch balance");
      }

      const data = await response.json();
      setBalance(data.balance);
      setAccountId(data.accountId);
    } catch {
      setMessage("Unable to load your account balance.");
    }
  }

  async function fetchTransactions() {
    try {
      const response = await fetch(
        "http://localhost:8080/api/accounts/transactions",
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        },
      );

      if (response.status === 401) {
        handleLogout();
        setMessage("Session expired. Please log in again.");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }

      const data = await response.json();
      setTransactions(data);
    } catch {
      setMessage("Unable to load transaction history.");
    }
  }

  async function handleDeposit() {
    if (!depositAmount || Number(depositAmount) <= 0) {
      setMessage("Please enter an amount greater than ₹0.");
      return;
    }
    setIsDepositing(true);

    try {
      const response = await fetch(
        "http://localhost:8080/api/accounts/deposit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify({
            amount: Number(depositAmount),
          }),
        },
      );

      const data = await response.json();

      if (response.status === 401) {
        handleLogout();
        setMessage("Session expired. Please log in again.");
        return;
      }

      if (!response.ok) {
        setMessage(data.message || data.error || "Deposit failed.");
        return;
      }

      setMessage("Deposit successful!");
      setDepositAmount("");
      await fetchBalance();
      await fetchTransactions();
    } catch {
      setMessage("Unable to connect to the server. Please try again.");
    } finally {
      setIsDepositing(false);
    }
  }

  async function handleWithdraw() {
    if (!withdrawAmount || Number(withdrawAmount) <= 0) {
      setMessage("Please enter an amount greater than ₹0.");
      return;
    }
    setIsWithdrawing(true);
    try {
      const response = await fetch(
        "http://localhost:8080/api/accounts/withdraw",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify({
            amount: Number(withdrawAmount),
          }),
        },
      );

      const data = await response.json();

      if (response.status === 401) {
        handleLogout();
        setMessage("Session expired. Please log in again.");
        return;
      }

      if (!response.ok) {
        setMessage(
          data.message || data.error || "Withdrawal failed. Please try again.",
        );
        return;
      }

      setMessage("Withdrawal successful!");
      setWithdrawAmount("");
      await fetchBalance();
      await fetchTransactions();
    } catch {
      setMessage("Unable to connect to the server. Please try again.");
    } finally {
      setIsWithdrawing(false);
    }
  }

  async function handleTransfer() {
    if (!recipientAccountId || Number(recipientAccountId) <= 0) {
      setMessage("Please enter a valid recipient account ID.");
      return;
    }

    if (!transferAmount || Number(transferAmount) <= 0) {
      setMessage("Please enter an amount greater than ₹0.");
      return;
    }
    setIsTransferring(true);
    try {
      const response = await fetch(
        "http://localhost:8080/api/accounts/transfer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify({
            recipientUserId: Number(recipientAccountId),
            amount: Number(transferAmount),
          }),
        },
      );

      const data = await response.json();

      if (response.status === 401) {
        handleLogout();
        setMessage("Session expired. Please log in again.");
        return;
      }

      if (!response.ok) {
        setMessage(data.message || data.error || "Transfer failed.");
        return;
      }

      setMessage("Transfer successful!");
      setRecipientAccountId("");
      setTransferAmount("");
      await fetchBalance();
      await fetchTransactions();
    } catch {
      setMessage("Unable to connect to the server. Please try again.");
    } finally {
      setIsTransferring(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");

    setIsLoggedIn(false);
    setShowLogin(false);
    setShowRegister(false);

    setBalance(null);
    setAccountId(null);
    setTransactions([]);

    setEmail("");
    setPassword("");
    setDepositAmount("");
    setWithdrawAmount("");
    setTransferAmount("");
    setRecipientAccountId("");

    setMessage("You have logged out successfully.");
  }

  return (
    <div>
      <h1>CoreBank</h1>
      {message && (
        <p
          className={`status-message ${
            message.toLowerCase().includes("successful") ||
            message.toLowerCase().includes("welcome")
              ? "success-message"
              : message.toLowerCase().includes("unable") ||
                  message.toLowerCase().includes("failed") ||
                  message.toLowerCase().includes("invalid") ||
                  message.toLowerCase().includes("insufficient") ||
                  message.toLowerCase().includes("please enter")
                ? "error-message"
                : ""
          }`}
        >
          {message}
        </p>
      )}{" "}
      <p>Your money, managed simply.</p>
      {isLoggedIn && balance !== null && (
        <div className="balance-card">
          <p>Available Balance</p>
          <h2>₹{Number(balance).toFixed(2)}</h2>
          <p>Your CoreBank account</p>
        </div>
      )}
      {isLoggedIn && (
        <div>
          <h2>Transaction History</h2>

          {transactions.length === 0 ? (
            <p>No transactions yet.</p>
          ) : (
            transactions.map((transaction) => (
              <div key={transaction.id} className="transaction-item">
                <div>
                  <strong>
                    {transaction.type === "DEPOSIT"
                      ? "Deposit"
                      : transaction.type === "WITHDRAWAL"
                        ? "Withdrawal"
                        : transaction.fromAccountId === accountId
                          ? "Transfer sent"
                          : "Transfer received"}
                  </strong>

                  <p>{new Date(transaction.createdAt).toLocaleString()}</p>
                </div>

                <strong
                  className={
                    transaction.type === "DEPOSIT" ||
                    (transaction.type === "TRANSFER" &&
                      transaction.toAccountId === accountId)
                      ? "transaction-credit"
                      : "transaction-debit"
                  }
                >
                  {transaction.type === "DEPOSIT" ||
                  (transaction.type === "TRANSFER" &&
                    transaction.toAccountId === accountId)
                    ? "+"
                    : "-"}
                  ₹ {Number(transaction.amount).toFixed(2)}
                </strong>
              </div>
            ))
          )}
        </div>
      )}
      {isLoggedIn && (
        <div>
          <h2>Deposit Money</h2>
          <input
            type="number"
            min="0.01"
            step="0.01"
            placeholder="Enter amount"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
          />
          <button onClick={handleDeposit} disabled={isDepositing}>
            {isDepositing ? "Depositing..." : "Deposit"}
          </button>{" "}
        </div>
      )}
      {isLoggedIn && (
        <div>
          <h2>Withdraw Money</h2>
          <input
            type="number"
            min="0.01"
            step="0.01"
            placeholder="Enter amount"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
          />
          <button onClick={handleWithdraw} disabled={isWithdrawing}>
            {isWithdrawing ? "Withdrawing..." : "Withdraw"}
          </button>{" "}
        </div>
      )}
      {isLoggedIn && (
        <div>
          <h2>Transfer Money</h2>
          <input
            type="number"
            min="1"
            step="1"
            placeholder="Recipient User ID"
            value={recipientAccountId}
            onChange={(e) => setRecipientAccountId(e.target.value)}
          />
          <input
            type="number"
            min="0.01"
            step="0.01"
            placeholder="Amount to transfer"
            value={transferAmount}
            onChange={(e) => setTransferAmount(e.target.value)}
          />
          <button onClick={handleTransfer} disabled={isTransferring}>
            {isTransferring ? "Transferring..." : "Transfer"}
          </button>{" "}
        </div>
      )}
      {isLoggedIn && <button onClick={handleLogout}>Logout</button>}
      {showLogin && !isLoggedIn && (
        <div className="auth-card">
          <h2>Login to CoreBank</h2>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <br />

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <br />

          <button onClick={handleLogin}>Submit</button>
        </div>
      )}
      {showRegister && !isLoggedIn && (
        <div className="auth-card">
          <h2>Create a CoreBank Account</h2>

          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <br />

          <input
            type="email"
            placeholder="Enter your email"
            value={registerEmail}
            onChange={(e) => setRegisterEmail(e.target.value)}
          />

          <br />

          <input
            type="password"
            placeholder="Create a password"
            value={registerPassword}
            onChange={(e) => setRegisterPassword(e.target.value)}
          />

          <br />

          <button onClick={handleRegister}>Submit Registration</button>
        </div>
      )}
      {!isLoggedIn && (
        <>
          <button
            onClick={() => {
              setMessage("");
              setShowRegister(false);
              setShowLogin(true);
            }}
          >
            Login
          </button>

          <button
            onClick={() => {
              setMessage("");
              setShowRegister(true);
              setShowLogin(false);
            }}
          >
            Register
          </button>
        </>
      )}
    </div>
  );
}

export default App;
