// https://github.com/fingerprintjs/fingerprintjs/blob/master/src/sources/audio.ts


/**
 * Makes the given promise never emit an unhandled promise rejection console warning.
 * The promise will still pass errors to the next promises.
 *
 * Otherwise, promise emits a console warning unless it has a `catch` listener.
 */
export function suppressUnhandledRejectionWarning(promise) {
    promise.then(undefined, () => undefined)
}

export function isPromise(value) {
    return !!value && typeof (value).then === 'function'
  }
/**
 * Checks whether the browser is based on WebKit version ≥616 (Safari ≥17) without using user-agent.
 * It doesn't check that the browser is based on WebKit, there is a separate function for this.
 *
 * @see https://developer.apple.com/documentation/safari-release-notes/safari-17-release-notes Safari 17 release notes
 * @see https://tauri.app/v1/references/webview-versions/#webkit-versions-in-safari Safari-WebKit versions map
 */
export function isWebKit616OrNewer() {
    const w = window
    const n = navigator
    const { CSS, HTMLButtonElement } = w
  
    return (
      countTruthy([
        !('getStorageUpdates' in n),
        HTMLButtonElement && 'popover' in HTMLButtonElement.prototype,
        'CSSCounterStyleRule' in w,
        CSS.supports('font-size-adjust: ex-height 0.5'),
        CSS.supports('text-transform: full-width'),
      ]) >= 4
    )
  }
/**
 * Checks whether the browser is based on WebKit version ≥606 (Safari ≥12) without using user-agent.
 * It doesn't check that the browser is based on WebKit, there is a separate function for this.
 *
 * @see https://en.wikipedia.org/wiki/Safari_version_history#Release_history Safari-WebKit versions map
 */
export function isWebKit606OrNewer() {
    // Checked in Safari 9–17
    const w = window
  
    return (
      countTruthy([
        'DOMRectList' in w,
        'RTCPeerConnectionIceEvent' in w,
        'SVGGeometryElement' in w,
        'ontransitioncancel' in w,
      ]) >= 3
    )
  }
  
/**
 * Checks whether the browser is based on mobile or desktop Safari without using user-agent.
 * All iOS browsers use WebKit (the Safari engine).
 *
 * Warning for package users:
 * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
 */
export function isWebKit() {
    // Based on research in September 2020
    const w = window
    const n = navigator
  
    return (
      countTruthy([
        'ApplePayError' in w,
        'CSSPrimitiveValue' in w,
        'Counter' in w,
        n.vendor.indexOf('Apple') === 0,
        'getStorageUpdates' in n,
        'WebKitMediaKeys' in w,
      ]) >= 4
    )
  }
/**
 * Checks whether this WebKit browser is Safari.
 * It doesn't check that the browser is based on WebKit, there is a separate function for this.
 *
 * Warning! The function works properly only for Safari version 15 and newer.
 */
export function isSafariWebKit() {
    // Checked in Safari, Chrome, Firefox, Yandex, UC Browser, Opera, Edge and DuckDuckGo.
    // iOS Safari and Chrome were checked on iOS 11-17. DuckDuckGo was checked on iOS 17 and macOS 14.
    // Desktop Safari versions 12-17 were checked.
    // The other browsers were checked on iOS 17; there was no chance to check them on the other OS versions.
  
    const w = window
  
    if (!isFunctionNative(w.print)) {
      return false // Chrome, Firefox, Yandex, DuckDuckGo macOS, Edge
    }
  
    return (
      countTruthy([
        // Incorrect in Safari <= 14 (iOS and macOS)
        String((w).browser) === '[object WebPageNamespace]',
        // Incorrect in desktop Safari and iOS Safari <= 15
        'MicrodataExtractor' in w,
      ]) >= 1
    )
  }

export function isDesktopWebKit() {
    // Checked in Safari and DuckDuckGo
  
    const w = window
    const { HTMLElement, Document } = w
  
    return (
      countTruthy([
        'safari' in w, // Always false in Karma and BrowserStack Automate
        !('ongestureend' in w),
        !('TouchEvent' in w),
        !('orientation' in w),
        HTMLElement && !('autocapitalize' in HTMLElement.prototype),
        Document && 'pointerLockElement' in Document.prototype,
      ]) >= 4
    )
  }

 const SpecialFingerprint = {
    /** The browser is known for always suspending audio context, thus making fingerprinting impossible */
    KnownForSuspending : -1,
    /** The browser doesn't support audio context */
    NotSupported : -2,
    /** An unexpected timeout has happened */
    Timeout : -3,
    /** The browser is known for applying anti-fingerprinting measures in all or some critical modes */
    KnownForAntifingerprinting : -4,
}
const InnerErrorName = {
   Timeout : 'timeout',
    Suspended : 'suspended'
}

/**
 * A deep description: https://fingerprint.com/blog/audio-fingerprinting/
 * Inspired by and based on https://github.com/cozylife/audio-fingerprint
 *
 * A version of the entropy source with stabilization to make it suitable for static fingerprinting.
 * Audio signal is noised in private mode of Safari 17, so audio fingerprinting is skipped in Safari 17.
 * 
 * arg -> returns
 * (): number | (() => Promise<number>)
 */
export default function getAudioFingerprint() {
    if (doesBrowserPerformAntifingerprinting()) {
      return SpecialFingerprint.KnownForAntifingerprinting
    }
  
    return getUnstableAudioFingerprint()
  }

  /**
 * A version of the entropy source without stabilization.
 *
 * Warning for package users:
 * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
 * arg -> returns
 * (): number | (() => Promise<number>)
 */
export function getUnstableAudioFingerprint() {
    const w = window
    const AudioContext = w.OfflineAudioContext || w.webkitOfflineAudioContext
    if (!AudioContext) {
      return SpecialFingerprint.NotSupported
    }
  
    // In some browsers, audio context always stays suspended unless the context is started in response to a user action
    // (e.g. a click or a tap). It prevents audio fingerprint from being taken at an arbitrary moment of time.
    // Such browsers are old and unpopular, so the audio fingerprinting is just skipped in them.
    // See a similar case explanation at https://stackoverflow.com/questions/46363048/onaudioprocess-not-called-on-ios11#46534088
    if (doesBrowserSuspendAudioContext()) {
      return SpecialFingerprint.KnownForSuspending
    }
  
    const hashFromIndex = 4500
    const hashToIndex = 5000
    const context = new AudioContext(1, hashToIndex, 44100)
  
    const oscillator = context.createOscillator()
    oscillator.type = 'triangle'
    oscillator.frequency.value = 10000
  
    const compressor = context.createDynamicsCompressor()
    compressor.threshold.value = -50
    compressor.knee.value = 40
    compressor.ratio.value = 12
    compressor.attack.value = 0
    compressor.release.value = 0.25
  
    oscillator.connect(compressor)
    compressor.connect(context.destination)
    oscillator.start(0)
  
    const [renderPromise, finishRendering] = startRenderingAudio(context)
    const fingerprintPromise = renderPromise.then(
      (buffer) => getHash(buffer.getChannelData(0).subarray(hashFromIndex)),
      (error) => {
        if (error.name === InnerErrorName.Timeout || error.name === InnerErrorName.Suspended) {
          return SpecialFingerprint.Timeout
        }
        throw error
      },
    )
  
    // Suppresses the console error message in case when the fingerprint fails before requested
    suppressUnhandledRejectionWarning(fingerprintPromise)
  
    return () => {
      finishRendering()
      return fingerprintPromise
    }
  }
  
  /**
   * Checks if the current browser is known for always suspending audio context
   */
  function doesBrowserSuspendAudioContext() {
    // Mobile Safari 11 and older
    return isWebKit() && !isDesktopWebKit() && !isWebKit606OrNewer()
  }
  
  /**
   * Checks if the current browser is known for applying anti-fingerprinting measures in all or some critical modes
   */
  function doesBrowserPerformAntifingerprinting() {
    // Safari 17
    return isWebKit() && isWebKit616OrNewer() && isSafariWebKit()
  }
  
  /**
   * Starts rendering the audio context.
   * When the returned function is called, the render process starts finishing.
   */
  function startRenderingAudio(context) {
    const renderTryMaxCount = 3
    const renderRetryDelay = 500
    const runningMaxAwaitTime = 500
    const runningSufficientTime = 5000
    let finalize = () => undefined;
  
    const resultPromise = new Promise<AudioBuffer>((resolve, reject) => {
      let isFinalized = false
      let renderTryCount = 0
      let startedRunningAt = 0
  
      context.oncomplete = (event) => resolve(event.renderedBuffer)
  
      const startRunningTimeout = () => {
        setTimeout(
          () => reject(makeInnerError(InnerErrorName.Timeout)),
          Math.min(runningMaxAwaitTime, startedRunningAt + runningSufficientTime - Date.now()),
        )
      }
  
      const tryRender = () => {
        try {
          const renderingPromise = context.startRendering()
  
          // `context.startRendering` has two APIs: Promise and callback, we check that it's really a promise just in case
          if (isPromise(renderingPromise)) {
            // Suppresses all unhadled rejections in case of scheduled redundant retries after successful rendering
            suppressUnhandledRejectionWarning(renderingPromise)
          }
  
          switch (context.state) {
            case 'running':
              startedRunningAt = Date.now()
              if (isFinalized) {
                startRunningTimeout()
              }
              break
  
            // Sometimes the audio context doesn't start after calling `startRendering` (in addition to the cases where
            // audio context doesn't start at all). A known case is starting an audio context when the browser tab is in
            // background on iPhone. Retries usually help in this case.
            case 'suspended':
              // The audio context can reject starting until the tab is in foreground. Long fingerprint duration
              // in background isn't a problem, therefore the retry attempts don't count in background. It can lead to
              // a situation when a fingerprint takes very long time and finishes successfully. FYI, the audio context
              // can be suspended when `document.hidden === false` and start running after a retry.
              if (!document.hidden) {
                renderTryCount++
              }
              if (isFinalized && renderTryCount >= renderTryMaxCount) {
                reject(makeInnerError(InnerErrorName.Suspended))
              } else {
                setTimeout(tryRender, renderRetryDelay)
              }
              break
          }
        } catch (error) {
          reject(error)
        }
      }
  
      tryRender()
  
      finalize = () => {
        if (!isFinalized) {
          isFinalized = true
          if (startedRunningAt > 0) {
            startRunningTimeout()
          }
        }
      }
    })
  
    return [resultPromise, finalize]
  }
  // ArrayLike<number> : number
  function getHash(signal) {
    let hash = 0
    for (let i = 0; i < signal.length; ++i) {
      hash += Math.abs(signal[i])
    }
    return hash
  }
  
  function makeInnerError(name) {
    const error = new Error(name)
    error.name = name
    return error
  }




const result = getAudioFingerprint()

// A type guard
if (typeof result !== 'function') {
  throw new Error('Expected to be a function')
}
const fingerprint = await result()
const newFingerprint = await result()

const first = getAudioFingerprint()
const second = getAudioFingerprint()

if (first === second) {
  return
}

if (typeof first !== 'function' || typeof second !== 'function') {
  throw new Error('Expected to be a function')
}

