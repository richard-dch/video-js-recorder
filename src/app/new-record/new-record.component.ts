import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

declare var MediaRecorder;
declare var navigator;

@Component({
	selector: 'app-new-record',
	templateUrl: './new-record.component.html',
	styleUrls: ['./new-record.component.scss'],
})
export class NewRecordComponent implements OnInit {
	constructor() {}
	shouldStop = false;
	stopped = false;
	started: boolean = false;

	@ViewChild('video') video: ElementRef;
	@ViewChild('download') download: ElementRef;
	@ViewChild('stop') stop: ElementRef;

	stopRecording() {
		this.shouldStop = true;
		this.started = false;
	}

	ngOnInit(): void {
		const stopButton = document.getElementById('stop');
		const audioRecordConstraints = {
			echoCancellation: true,
		};
	}

	handleRecord({ stream, mimeType }) {
		//   this.startRecord();
		let recordedChunks = [];
		this.stopped = false;
		const mediaRecorder = new MediaRecorder(stream);

		mediaRecorder.ondataavailable = function (e) {
			if (e.data.size > 0) {
				recordedChunks.push(e.data);
			}

			if (this.shouldStop === true && this.stopped === false) {
				mediaRecorder.stop();
				this.stopped = true;
			}
		};

		mediaRecorder.onstop = function () {
			const blob = new Blob(recordedChunks, {
				type: mimeType,
			});
			recordedChunks = [];
			const filename = window.prompt('Enter file name');
			this.download.nativeElement.href = URL.createObjectURL(blob);
			this.download.nativeElement.download = `${filename || 'recording'}.webm`;
			this.stopRecording();
			this.video.nativeElement.srcObject = null;
		};

		mediaRecorder.start(200);
	}

	async recordScreen() {
		const mimeType = 'video/webm';
		this.shouldStop = false;
		this.started = true;

		const constraints = {
			video: {
				cursor: 'motion',
			},
		};

		if (!(navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia)) {
			return window.alert('Screen Record not supported!');
		}

		let stream = null;
		const displayStream = await navigator.mediaDevices.getDisplayMedia({ video: { cursor: 'motion' }, audio: { echoCancellation: true } });

		if (window.confirm('Record audio with screen?')) {
			const voiceStream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true }, video: false });
			let tracks = [...displayStream.getTracks(), ...voiceStream.getAudioTracks()];
			stream = new MediaStream(tracks);
			this.handleRecord({ stream, mimeType });
		} else {
			stream = displayStream;
			this.handleRecord({ stream, mimeType });
		}
		this.video.nativeElement.srcObject = stream;
	}
}
