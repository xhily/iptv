import { Stream } from '../models'
import { IPTVChecker } from 'iptv-checker'
import { TESTING } from '../constants'

export class StreamTester {
  checker: IPTVChecker

  constructor() {
    this.checker = new IPTVChecker()
  }

  async test(stream: Stream) {
    if (TESTING) {
      const results = (await import('../../tests/__data__/input/test_results/all.js')).default

      return results[stream.url]
    } else {
      return this.checker.checkStream({
        url: stream.url,
        http: {
          referrer: stream.httpReferrer,
          'user-agent': stream.httpUserAgent
        }
      })
    }
  }
}
