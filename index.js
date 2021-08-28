const { ChainId, Fetcher, WETH, Route, Trade, TokenAmount, TradeType, Percent } = require('@uniswap/sdk');
const ethers = require('ethers');

const chainId = ChainId.MAINNET;
const tokenAddress = '0x6b175474e89094c44da98b954eedeac495271d0f';

const init = async() => {
    try {
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

        // send transaction
        const provider = ethers.getDefaultProvider('mainnet', {
            infura: 'INFURA_ENDPOINT'
        });
        const signer = new ethers.Wallet('PRIVATE_KEY');
        const account = signer.connect(provider);
        const uniswap = new ethers.Contract(
            '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
            ['function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)'],
            account
        );
        
        // send transaction
        const tx = await uniswap.swapExactETHForTokens(
            amountOutMin,
            path,
            to,
            deadline,
            { value, gasPrice:20e9 }
        );
    
        console.log(`Transaction Hash: ${tx.hash}`);
        const receipt = await tx.wait();
        console.log(`Transaction was mined on block ${receipt.blockNumber}`);

    } catch (error) {
        console.error(error);
    }
}

init();
