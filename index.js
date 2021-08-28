const { ChainId, Fetcher, WETH, Route, Trade, TokenAmount, TradeType } = require('@uniswap/sdk');
const chainId = ChainId.MAINNET;
const tokenAddress = '0x6b175474e89094c44da98b954eedeac495271d0f';

const init = async() => {
    const dai = await Fetcher.fetchTokenData(chainId, tokenAddress);
    const weth = WETH[chainId];
    const pair = await Fetcher.fetchPairData(dai, weth);
    const route = new Route([pair], weth);
    const trade = new Trade(route, new TokenAmount(weth, '100000000000000000'), TradeType.EXACT_INPUT);
    console.log("DAI/WETH Mid Price", route.midPrice.toSignificant(6));
    //console.log(route.midPrice.invert().toSignificant(6));
    console.log("Execution Price: ", trade.executionPrice.toSignificant(6));
    console.log("Next MidPrice: ", trade.nextMidPrice.toSignificant(6));
}

init();
