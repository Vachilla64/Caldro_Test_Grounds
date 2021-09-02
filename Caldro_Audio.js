"use strict";
// [SID]
class experimental_DOMaudioManager {
	constructor() {
		this.initState = false;
		this.loadState = false;
		this.active = true
		this.addedSounds = 0;
		this.loadedSounds = 0;
		this.initialzedSounds = 0;
		this.masterVolume = 1;
		this.fileSrcPrefix = "";
		this.bank = new Array();
	}
	onInit() { };
	onload() { };
	initialize() {
		if (!this.active) return;
		console.log(this.bank)
		for (let sound of this.bank) {
			console.log(sound)
			let former_volume = sound.volume;
			sound.load();
			sound.onload = function () {}
			sound.currentTime = 1;
			sound.volume = 0;
			sound.loop = true
			sound.play();
			sound.loop = false;
			console.log("kkkkk")
			setTimeout(function () {
				console.log("kkkkk")
				sound.pause();
				sound.volume = former_volume;
				this.updateInitnfo();
				// this.onInit();
			}, 1000)
			sound.currentTime = 0;
		}
		// console.log("initialized")
	};

	pauseAll() {
		if (!this.active) return;
		for (let s in this.bank) {
			if (!this.isAudioFile(s) && Caldro.info.loggingIssus()) {
				//console.log("A non audio file is present in this sound bank \n That file is of type "+typeof this.bank[s]+"\n The non audio file")
				// console.log(this.bank[s])
			}
			this.bank[s].pause();
		}
	}

	play(id, cloneNode = false, cloneNodeVolume = null) {
		if (!this.active) return;
		if (this.bank[id]) {
			if (cloneNode) {
				let sound = this.bank[id].cloneNode(true)
				if (!cloneNodeVolume) {
					sound.volume = this.bank[id].volume;
				} else {
					sound.volume = cloneNodeVolume
				}
				sound.play();
			} else {
				this.bank[id].play();
			}
		}
	}

	pause(id) {
		if (!this.active) return;
		// console.log("Trying to pause Audio file tagged **"+id+"**, that file is "+this.bank[id])
		if (this.isAudioFile(id)) {
			this.bank[id].pause();
			// console.log(typeof this.bank[id])
		}
	}

	getTime(id) {
		return this.bank[id].currentTime;
	}

	isAudioFile(id) {
		if (this.initState)
			return getConstructorName(this.bank[id]) == "HTMLAudioElement"
	}

	get(id) {
		if (this.bank[id] != undefined) {
			return this.bank[id];
		} else {
			// console.log("Tried to get Audio file tagged **"+id+"**");
			return new Audio();
		}
	}

	setTime(id, value = 0) {
		this.bank[id].currentTime = value;
	}

	access() {
		this.initialize();
	};

	getLoadPercenteage() {
		return (this.loadedSounds / this.addedSounds) * 100;
	}

	updateLoadinfo() {
		++this.loadedSounds
		if (this.loadedSounds == this.addedSounds && this.loadState == false) {
			this.loadState = true;
			this.onload();
		}
	}

	updateInitnfo() {
		++this.initialzedSounds;
		if (this.initialzedSounds == this.addedSounds) {
			this.initState = true
			this.onInit();
		}
	}

	createSoundObjec() {
		let soundObject = {
			/* audioFile: audioFile,
			volume: volume,
			pitch: 1,
			speed: 1, */
		}
	}

	add(id, src, volume = 1) {
		if (!this.active) return;
		// let aud = document.createElement("audio");
		let audioManager = this
		let aud = new Audio()
		aud.src = this.fileSrcPrefix + src;
		aud.volume = volume;
		aud.psuedoVolume = volume
		aud.id = id;
		aud.preload = "auto";
		aud.controls = false;
		this.bank[id] = aud;
		++this.addedSounds;
		// document.body.appendChild(aud)
		aud.oncanplaythrough = function () {
			audioManager.updateLoadinfo()
		}
		aud.setVolume = function (volume = 1) {
			aud.psuedoVolume = volume
			aud.volume = aud.psuedoVolume * audioManager.masterVolume;
		}
		aud.getVolume = function (volume = 1) {
			return aud.psuedoVolume;
		}
	}

	setMasterVolume(volume = 1) {
		if (!this.active) return;
		this.masterVolume = volume
		for (let b in this.bank) {
			let sound = this.bank[b];
			sound.volume = sound.psuedoVolume * this.masterVolume
		}
	}

	update() {
		if (!this.active) return;
		for (let s in this.bank) {

		}
	}
}

function DOMaudioManager() {
	let audioManager = this;
	this.initState = false;
	this.loadState = false;
	this.active = true
	this.addedSounds = 0;
	this.loadedSounds = 0;
	this.masterVolume = 1;
	this.fileSrcPrefix = ""
	this.bank = [];

	this.onInit = function () { };
	this.initialize = function () {
		if(!this.active) return;
		for (let s = 0; s < this.bank.length; ++s) {
			try {
				let sound = this.bank[s]
				let former_volume = sound.volume;
				sound.load();
				sound.currentTime = 1;
				sound.volume = 0;
				sound.play();
				setTimeout(function () {
					sound.pause();
					sound.volume = former_volume;
					// this.onInit();
				}, 1000)
				sound.currentTime = 0;
			} catch (e) {
				/*window.onerror = function(e){
				  return true;
			    }*/
			}
		}
		this.initState = true
		// console.log("initialized")
	};

	this.pauseAll = function () {
		if(!this.active) return;
		for (let s in this.bank) {
			if (!this.isAudioFile(s) && Caldro.info.loggingIssus()) {
				//console.log("A non audio file is present in this sound bank \n That file is of type "+typeof this.bank[s]+"\n The non audio file")
				// console.log(this.bank[s])
			}
			this.bank[s].pause();
		}
	}

	this.play = function (id, cloneNode = false, time = null) {
		if(!this.active) return;
		if (this.bank[id]) {
			if (cloneNode) {
				let sound = this.bank[id].cloneNode(true)
				sound.volume = this.bank[id].volume;
				if(time != null) sound.currentTime = time;
				sound.play();
			} else {
				let sound = this.bank[id]
				if(time != null) sound.currentTime = time;
				sound.play();
			}
		}
	}

	this.pause = function (id) {
		if(!this.active) return;
		// console.log("Trying to pause Audio file tagged **"+id+"**, that file is "+this.bank[id])
		if (this.isAudioFile(id)) {
			this.bank[id].pause();
			// console.log(typeof this.bank[id])
		}
	}

	this.getTime = function (id) {
		return this.bank[id].currentTime;
	}

	this.isAudioFile = function (id) {
		if(this.bank[id]){
			return getConstructorName(this.bank[id]) == "HTMLAudioElement"
		}
	}

	this.get = function (id) {
		if (this.bank[id] != undefined) {
			return this.bank[id];
		} else {
			// console.log("Tried to get Audio file tagged **"+id+"**");
			return new Audio();
		}
	}

	this.setTime = function (id, value = 0) {
		this.bank[id].currentTime = value;
	}

	this.access = function () {
		this.initialize();
	};

	this.getLoadstate = function () {
		return (this.loadedSounds / this.addedSounds) * 100;
	}

	this.updateLoadinfo = function () {
		++this.loadedSounds
		if (this.loadedSounds == this.addedSounds && this.loadState == false) {
			this.loadState = true;
			this.onInit();
			//console.l555og("All ssounds have been initialized");
			this.access = function () { };
		} else {
			// console.log(this.loadedSounds)
		}
	}

	this.createSoundObject = function () {
		let soundObject = {
			/* audioFile: audioFile,
			volume: volume,
			pitch: 1,
			speed: 1, */
		}
	}

	this.add = function (id, src, volume = 1) {
		if(!this.active) return;
		// let aud = document.createElement("audio");
		let aud = new Audio()
		aud.src = this.fileSrcPrefix + src;
		aud.volume = volume;
		aud.psuedoVolume = volume
		aud.id = id;
		aud.preload = "auto";
		aud.controls = false;
		this.bank[id] = aud;
		++this.addedSounds;
		// document.body.appendChild(aud)
		aud.oncanplaythrough = function () {
			audioManager.updateLoadinfo()
		}
		aud.setVolume = function(volume = 1){
			aud.psuedoVolume = volume
			aud.volume = aud.psuedoVolume*audioManager.masterVolume;
		}
		aud.getVolume = function(volume = 1){
			return aud.psuedoVolume;
		}
	}

	this.setMasterVolume = function (volume = 1) {
		if(!this.active) return;
		this.masterVolume = volume
		for (let b in this.bank) {
			let sound = audioManager.bank[b];
			sound.volume = sound.psuedoVolume * audioManager.masterVolume
		}
	}

	this.update = function () {
		if(!this.active) return;
		for (let s in this.bank) {

		}
	}

}