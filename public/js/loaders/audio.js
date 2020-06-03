import {
    loadJSON
} from "../loaders.js";
import AudioBoard from "../AudioBoard.js";

// const audioContext = new AudioContext();
// const loadAudio = createAudioLoader(audioContext);
// loadAudio('./audio/jump.ogg')
//     .then(buffer => {
//         audioBoard.addAudio('jump', buffer);
//     });
// loadAudio('./audio/stomp.ogg')
//     .then(buffer => {
//         audioBoard.addAudio('stomp', buffer);
//     });

export const loadAudioBoard = (name, audioContext) => {
    const loadAudio = createAudioLoader(audioContext);
    return loadJSON(`/sounds/${name}.json`)
        .then(audioSheet => {
            const audioBoard = new AudioBoard();
            const {
                fx
            } = audioSheet;
            const jobs = [];
            Object.keys(fx).forEach(name => {
                const {
                    url
                } = fx[name];
                const job = loadAudio(url).then(buffer => {
                    audioBoard.addAudio(name, buffer);
                });
                jobs.push(job);
            });
            return Promise.all(jobs).then(() => audioBoard);
        });

};

export const createAudioLoader = (context) => {
    return function loadAudio(url) {
        return fetch(url)
            .then(response => {
                return response.arrayBuffer();
            })
            .then(arrayBuffer => {
                return context.decodeAudioData(arrayBuffer);
            });
    };
};