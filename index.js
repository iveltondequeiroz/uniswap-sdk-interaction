const { ChainId, Fetcher, WETH, Route, Trade, TokenAmount, TradeType, Percent } = require('@uniswap/sdk');
const chainId = ChainId.MAINNET;
const tokenAddress = '0x6b175474e89094c44da98b954eedeac495271d0f';

const init = async() => {
    const dai = await Fetcher.fetchTokenData(chainId, tokenAddress);
    const weth = WETH[chainId];
    // create pair
    const pair = await Fetcher.fetchPairData(dai, weth);
    const route = new Route([pair], weth);
    // create trade
    const trade = new Trade(route, new TokenAmount(weth, '100000000000000000'), TradeType.EXACT_INPUT);
    console.log("DAI/WETH Mid Price", route.midPrice.toSignificant(6));
    console.log("Inverted Mid Price", route.midPrice.invert().toSignificant(6));
    console.log("Execution Price: ", trade.executionPrice.toSignificant(6));
    console.log("Next MidPrice: ", trade.nextMidPrice.toSignificant(6));

    // create transaction
    const slippageTolerance = new Percent('50', '10000'); // 50 bips
    const amountOutMin = trade.minimumAmountOut(slippageTolerance).raw; // min amount of dai to buy 
    const path = [weth.address, dai.address];
    const to = '';
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
    const value = trade.inputAmount.raw;

}

init();
