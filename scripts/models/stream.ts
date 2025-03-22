import { URL, Collection } from '@freearhey/core'
import { Category, Language } from './index'

type StreamProps = {
  name: string
  url: string
  filepath: string
  line: number
  channel?: string
  httpReferrer?: string
  httpUserAgent?: string
  label?: string
  quality?: string
}

export class Stream {
  channel: string
  filepath: string
  line: number
  httpReferrer: string
  label: string
  name: string
  quality: string
  url: string
  httpUserAgent: string
  logo: string
  broadcastArea: Collection
  categories: Collection
  languages: Collection
  isNSFW: boolean
  groupTitle: string
  removed: boolean = false

  constructor({
    channel,
    filepath,
    line,
    httpReferrer,
    label,
    name,
    quality,
    url,
    httpUserAgent
  }: StreamProps) {
    this.channel = channel || ''
    this.filepath = filepath
    this.line = line
    this.httpReferrer = httpReferrer || ''
    this.label = label || ''
    this.name = name
    this.quality = quality || ''
    this.url = url
    this.httpUserAgent = httpUserAgent || ''
    this.logo = ''
    this.broadcastArea = new Collection()
    this.categories = new Collection()
    this.languages = new Collection()
    this.isNSFW = false
    this.groupTitle = 'Undefined'
  }

  normalizeURL() {
    const url = new URL(this.url)

    this.url = url.normalize().toString()
  }

  clone(): Stream {
    return Object.assign(Object.create(Object.getPrototypeOf(this)), this)
  }

  hasName(): boolean {
    return !!this.name
  }

  noName(): boolean {
    return !this.name
  }

  hasChannel() {
    return !!this.channel
  }

  hasCategories(): boolean {
    return this.categories.notEmpty()
  }

  noCategories(): boolean {
    return this.categories.isEmpty()
  }

  hasCategory(category: Category): boolean {
    return this.categories.includes((_category: Category) => _category.id === category.id)
  }

  noLanguages(): boolean {
    return this.languages.isEmpty()
  }

  hasLanguage(language: Language): boolean {
    return this.languages.includes((_language: Language) => _language.code === language.code)
  }

  noBroadcastArea(): boolean {
    return this.broadcastArea.isEmpty()
  }

  isInternational(): boolean {
    return this.broadcastArea.includes('r/INT')
  }

  isSFW(): boolean {
    return this.isNSFW === false
  }

  getTitle(): string {
    let title = `${this.name}`

    if (this.quality) {
      title += ` (${this.quality})`
    }

    if (this.label) {
      title += ` [${this.label}]`
    }

    return title
  }

  data() {
    return {
      channel: this.channel,
      filepath: this.filepath,
      httpReferrer: this.httpReferrer,
      label: this.label,
      name: this.name,
      quality: this.quality,
      url: this.url,
      httpUserAgent: this.httpUserAgent,
      line: this.line
    }
  }

  toJSON() {
    return {
      channel: this.channel || null,
      url: this.url,
      referrer: this.httpReferrer || null,
      user_agent: this.httpUserAgent || null
    }
  }

  toString(options: { public: boolean }) {
    let output = `#EXTINF:-1 tvg-id="${this.channel}"`

    if (options.public) {
      output += ` tvg-logo="${this.logo}" group-title="${this.groupTitle}"`
    }

    if (this.httpReferrer) {
      output += ` http-referrer="${this.httpReferrer}"`
    }

    if (this.httpUserAgent) {
      output += ` http-user-agent="${this.httpUserAgent}"`
    }

    output += `,${this.getTitle()}`

    if (this.httpReferrer) {
      output += `\n#EXTVLCOPT:http-referrer=${this.httpReferrer}`
    }

    if (this.httpUserAgent) {
      output += `\n#EXTVLCOPT:http-user-agent=${this.httpUserAgent}`
    }

    output += `\n${this.url}`

    return output
  }
}
