import TooltipOne from "@/app/components/ui/TooltipOne";
import React, { useState } from "react";

type Crypto = "BTC" | "ETH" | "BNB" | "SOL" | "XRP" | "USDT";

type InvestType = "invest" | "invested";

const CryptoReturnCalculator: React.FC = () => {
  const [investType, setInvestType] = useState<InvestType>("invest");
  const [coin, setCoin] = useState<Crypto>("BTC");
  const [amount, setAmount] = useState<number | "">("");
  const [futurePrice, setFuturePrice] = useState<number | "">("");
  const [date, setDate] = useState<string>("");
  const [result, setResult] = useState<string>("");

  const calculateReturn = async () => {
    const currentPrice = await fetchCurrentPrice(coin);

    if (investType === "invest") {
      if (typeof amount === "number" && typeof futurePrice === "number") {
        const coinsOwned = amount / currentPrice;
        const resultValue = coinsOwned * futurePrice;
        displayResult(investType, amount, coin, futurePrice, date, resultValue);
      }
    } else {
      const historicalPrice = await fetchHistoricalPrice(coin, new Date(date));
      if (typeof amount === "number" && typeof futurePrice === "number") {
        const coinsOwned = amount / historicalPrice;
        const resultValue = coinsOwned * futurePrice;
        displayResult(investType, amount, coin, futurePrice, date, resultValue);
      }
    }
  };

  const displayResult = (
    investType: InvestType,
    amount: number,
    coin: Crypto,
    futurePrice: number,
    date: string,
    resultValue: number
  ) => {
    let resultText = "";
    if (investType === "invest") {
      resultText = `If you invest $${amount.toFixed(
        2
      )} in ${coin} and it goes to $${futurePrice.toFixed(2)},`;
    } else {
      resultText = `If you invested $${amount.toFixed(
        2
      )} in ${coin} on ${new Date(
        date
      ).toDateString()} and it goes to $${futurePrice.toFixed(2)},`;
    }

    resultText += ` it would be worth $${resultValue.toFixed(2)}.<br>`;
    const profit = resultValue - amount;
    const returnPercentage = (profit / amount) * 100;
    resultText += `Total profit: $${profit.toFixed(
      2
    )} (${returnPercentage.toFixed(2)}%)`;

    setResult(resultText);
  };

  const fetchCurrentPrice = (coin: Crypto): Promise<number> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockPrices: Record<Crypto, number> = {
          BTC: 62482.64,
          ETH: 2428.2,
          BNB: 314.71,
          SOL: 147.39,
          XRP: 0.6199,
          USDT: 1,
        };
        resolve(mockPrices[coin]);
      }, 500);
    });
  };

  const fetchHistoricalPrice = (coin: Crypto, date: Date): Promise<number> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockPrices: Record<Crypto, number> = {
          BTC: 50000,
          ETH: 2000,
          BNB: 250,
          SOL: 100,
          XRP: 0.5,
          USDT: 1,
        };
        resolve(mockPrices[coin]);
      }, 500);
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-md shadow-md w-full border flex flex-col gap-1">
        <h1 className="text-center text-[#42acd8] font-semibold text-2xl mb-1 flex gap-2 items-center justify-center">
          Crypto Return Calculator
        </h1>

        <p className="flex gap-2 items-center justify-center">
          <span>Estimate the value of buying and selling crypto</span>

          <TooltipOne
            text={
              <div className="flex flex-col gap-1 items-start justify-center">
                <p className="whitespace-normal leading-normal">
                  Disclosure: This is an estimate for educational purposes only.
                </p>
                <p className="whitespace-normal leading-normal">
                  Please contact your crypto stock-trading advisors for full
                  details and results.
                </p>
              </div>
            }
          />
        </p>

        <div className="mb-4 mt-4">
          <label
            htmlFor="investType"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            If You:
          </label>
          <select
            id="investType"
            value={investType}
            onChange={(e) => setInvestType(e.target.value as InvestType)}
            className="w-full p-3 border rounded-md mb-4 focus:border-[#42acd8]  focus:outline-none focus:ring-[#42acd8]"
          >
            <option value="invest">Invest</option>
            <option value="invested">Invested</option>
          </select>
        </div>

        <div className="mb-4">
          <label
            htmlFor="coin"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Cryptocurrency:
          </label>
          <select
            id="coin"
            value={coin}
            onChange={(e) => setCoin(e.target.value as Crypto)}
            className="w-full p-3 border focus:border-[#42acd8]  focus:outline-none focus:ring-[#42acd8] rounded-md mb-4"
          >
            <option value="BTC">Bitcoin (BTC)</option>
            <option value="ETH">Ethereum (ETH)</option>
            <option value="BNB">Binance Coin (BNB)</option>
            <option value="SOL">Solana (SOL)</option>
            <option value="XRP">Ripple (XRP)</option>
            <option value="USDT">Tether (USDT)</option>
          </select>
        </div>

        <div className="mb-4">
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Total Investment ($):
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) =>
              setAmount(e.target.value ? parseFloat(e.target.value) : "")
            }
            placeholder="Enter amount"
            className="w-full p-3 border focus:border-[#42acd8]  focus:outline-none focus:ring-[#42acd8] rounded-md"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="futurePrice"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            And it goes to ($):
          </label>
          <input
            type="number"
            id="futurePrice"
            value={futurePrice}
            onChange={(e) =>
              setFuturePrice(e.target.value ? parseFloat(e.target.value) : "")
            }
            placeholder="Enter future price"
            className="w-full p-3 border focus:border-[#42acd8]  focus:outline-none focus:ring-[#42acd8] rounded-md"
          />
        </div>

        {investType === "invested" && (
          <div className="mb-4">
            <label
              htmlFor="date"
              className="block text-black font-semibold mb-2"
            >
              Purchase Date:
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-3 border-2 border-blue-500 rounded-xl mb-4"
            />
          </div>
        )}

        <button
          onClick={calculateReturn}
          className="w-full py-4 bg-[#42acd8] text-white rounded-xl text-lg hover:bg-[#3798c0] transition-colors"
        >
          Calculate Return
        </button>

        {result && (
          <div
            id="result"
            className="mt-4 text-center text-lg font-bold text-black"
            dangerouslySetInnerHTML={{ __html: result }}
          />
        )}
      </div>
    </div>
  );
};

export default CryptoReturnCalculator;
