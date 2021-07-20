import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import videojs from 'video.js';
import * as RecordRTC from 'recordrtc';
import * as Record from 'videojs-record/dist/videojs.record.js';
@Component({
  selector: 'app-video-record',
  templateUrl: './video-record.component.html',
  styleUrls: ['./video-record.component.scss']
})
export class VideoRecordComponent implements OnInit,OnDestroy {
	private _elementRef: ElementRef;
	// index to create unique ID for component
	idx = 'clip1';
	private config: any;
	private player: any;
	private plugin: any;
	// constructor initializes our declared vars
	constructor(elementRef: ElementRef) {
		this.player = false;
		// save reference to plugin (so it initializes)
		this.plugin = Record;
		// video.js configuration
		this.config = {
			controls: true,
			autoplay: false,
			fluid: false,
			loop: false,
			width: 320,
			height: 240,
			bigPlayButton: false,
			controlBar: {
				volumePanel: false,
			},
			plugins: {
				// configure videojs-record plugin
				record: {
					screen: true,
					video: false,
					audio: true,
					debug: true,
					maxLength: 60,
					videoMimeType: 'video/webm;codecs=H264',
				},
			},
		};
	}
	ngOnInit() {}
	// use ngAfterViewInit to make sure we initialize the videojs element
	// after the component template itself has been rendered
	ngAfterViewInit() {
		// ID with which to access the template's video element
		let el = 'video_' + this.idx;
		// setup the player via the unique element ID
		this.player = videojs(document.getElementById(el), this.config, () => {
			console.log('player ready! id:', el);
			// print version information at startup
			var msg =
				'Using video.js ' + videojs.VERSION + ' with videojs-record ' + videojs.getPluginVersion('record') + ' and recordrtc ' + RecordRTC.version;
			videojs.log(msg);
		});
		// device is ready
		this.player.on('deviceReady', () => {
			console.log('device is ready!');
		});
		// user clicked the record button and started recording
		this.player.on('startRecord', () => {
			console.log('started recording!');
			this.player.on('audioOutputReady', function () {
				console.log('Changed audio output to deviceId:');
			});
		});
		// user completed recording and stream is available
		this.player.on('finishRecord', () => {
			// recordedData is a blob object containing the recorded data that
			// can be downloaded by the user, stored on server etc.
			console.log('finished recording: ', this.player.recordedData);
		});
		// error handling
		this.player.on('error', (element, error) => {
			console.warn(error);
		});
		this.player.on('deviceError', () => {
			console.error('device error:', this.player.deviceErrorCode);
		});
	}
	// use ngOnDestroy to detach event handlers and remove the player
	ngOnDestroy() {
		if (this.player) {
			this.player.dispose();
			this.player = false;
		}
	}
}
