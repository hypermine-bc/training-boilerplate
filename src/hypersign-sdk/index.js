const ProviderEngine = require('web3-provider-engine');
const CacheSubprovider = require('web3-provider-engine/subproviders/cache');
const FixtureSubprovider = require('web3-provider-engine/subproviders/fixture');
const FilterSubprovider = require('web3-provider-engine/subproviders/filters');
const VmSubprovider = require('web3-provider-engine/subproviders/vm');
const HookedWalletSubprovider = require('web3-provider-engine/subproviders/hooked-wallet');
const NonceSubprovider = require('web3-provider-engine/subproviders/nonce-tracker');
const RpcSubprovider = require('web3-provider-engine/subproviders/rpc');
// const walletController = require("./controllers/wallet-controller");
// const TSIEventEmitter = require("./events/tsi-eventemitter")
const HSDispatcher = require('./dispatcher/dispatcher.js')



export  default function HyperSignProvider(rpcAddress)  {
	
	var engine = new ProviderEngine();
	engine.addProvider(new FixtureSubprovider({
		web3_clientVersion: 'ProviderEngine/v0.0.0/javascript',
		net_listening: true,
		eth_hashrate: '0x00',
		eth_mining: false,
		eth_syncing: true,
	}));
	// cache layer
	engine.addProvider(new CacheSubprovider());

	// filters
	engine.addProvider(new FilterSubprovider());

	// pending nonce
	engine.addProvider(new NonceSubprovider());

	// vm
	engine.addProvider(new VmSubprovider());

	// id mgmt
	engine.addProvider(new HookedWalletSubprovider({
		getAccounts : (cb) => {
			// debugger
			// TSIController.getAccounts().then(accounts => {
				let accounts = ['0x87cbccfb3726e4425c6ce513bae544777d486cc0']
			    cb(null, accounts)
			// }).catch(cb);
		},
		signTransaction : (rawTx, cb) => {
			debugger
			rawTx.gasLimit = "0x186A0"
			HSDispatcher.default.QREventGenerator(rawTx)
			.then(()=>{
				HSDispatcher.default.TXEventListener()
				.then((object)=>{
					debugger
					console.log('In SignTransaction method')
					let digest = '0x' + object.signedRsv.toString('hex')
					console.log(digest)
					cb(null, digest);
				})
			})
		}
	}));

	// data source
	engine.addProvider(new RpcSubprovider({
		rpcUrl: rpcAddress,
	}));

	// log new blocks
	engine.on('block', block => {
		console.log('================================');
		console.log('BLOCK CHANGED:', '#' + block.number.toString('hex'), '0x' + block.hash.toString('hex'));
		console.log('================================');
	});

	// network connectivity error
	engine.on('error', err => {
		// report connectivity errors
		console.error(err.stack);
	});

	// start polling for blocks
	engine.start();

	return engine;
}


// module.exports = HyperSignProvider;