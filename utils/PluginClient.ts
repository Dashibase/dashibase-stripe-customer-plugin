function randomAlphabetString(length:number) {
  let result = ''
  const characters = 'abcdefghijklmnopqrstuvwxyz'
  const charactersLength = characters.length
  for ( let i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

export enum MessageType {
  SETUP = 'Setup',
  SET_DIM = 'Set Dimensions',
  REQUEST = 'Request',
  RESPOND = 'Respond',
  STORE = 'Store',
}

export interface SetupMessage {
  id: string;
  messageType: MessageType;
  store: { [k:string]: any };
  columnIds: string[];
  foreignColumnIds: string[];
}

export interface SetDimensionsMessage {
  id: string;
  messageType: MessageType;
  height?: number;
  width?: number;
  resizable: "height"|"width"|boolean;
}

export interface RequestMessage {
  id: string;
  messageType: MessageType;
  key: string;
}

export interface RespondMessage {
  id: string;
  messageType: MessageType;
  key: string;
  value: any;
}

export interface StoreMessage {
  id: string;
  messageType: MessageType;
  key: string;
  value: any;
}

export class PluginClient {
  source: MessageEventSource|null
  sourceOrigin: string 

  constructor () {
    // Dashibase's window to send and receive messages
    this.source = null
    this.sourceOrigin = ''
  }

  init () {
    const message = {
      messageType: MessageType.SETUP
    }
    parent.postMessage(message, "*")
  }

  isFromDashibase (url: string) {
    if (this.sourceOrigin) return url === this.sourceOrigin
    const isFromDashibase = url.startsWith('https://beta.dashibase.com') || url.startsWith('https://alpha-451.dashibase.com')
      || url.startsWith('https://dashibase.com') || url.startsWith('http://localhost:')
    if (isFromDashibase) this.sourceOrigin = url
    return isFromDashibase
  }

  /**
   * @param {(payload: SetupMessage) => void} func Function to call with message payload
   * 
   * This is required for all plugins.
   * It is used to retrieve the PluginClient's source (which should
   * be Dashibase's window) and to initialize the plugin with any
   * persistent state and the list of columnIds/foreignColumnIds etc. 
   */
  onSetup (func: (payload: SetupMessage) => void) {
    const controller = new AbortController()
    // Listen for the SetupMessage
    window.addEventListener("message", (event: MessageEvent<SetupMessage>) => {
      // Check event.origin to make sure it's from Dashibase
      if (!this.isFromDashibase(event.origin)) return
      // Handle SetupMessage
      if (event.data.messageType === MessageType.SETUP) {
        console.log("PLUGIN: setup message", event.data)
        this.source = event.source
        func(event.data)
        controller.abort()
      }
    }, {
      signal: controller.signal,
    })
  }

  /**
   * 
   * @param {number|undefined} height Height of Plugin Block on dashboard (optional)
   * @param {number|undefined} width Width of Plugin Block on dashboard (optional)
   * @param {"height"|"width"|boolean} resizable Whether the user can resize the block or only resize height or width
   * 
   * This is used to set the height and width of the Plugin Block.
   * The "resizable" param defines if the user can resize the block or only resize height or width.
   * 
   * This returns a promise which should resolve to the same
   * SetDimensionsMessage object.
   */
  setBlockDimensions (height: number|undefined=undefined, width: number|undefined=undefined, resizable: "height"|"width"|boolean=false) {
    if (!this.source) throw Error('No EventSource found. Make sure you receive the Setup message first.')

    const controller = new AbortController()
    const messageId = randomAlphabetString(10)
    type CallbackFunction = (value: SetDimensionsMessage) => SetDimensionsMessage
    let resolveMessage: CallbackFunction|undefined = undefined

    // Listen for the reply SetDimensionsMessage which implies success
    window.addEventListener("message", (event: MessageEvent<SetDimensionsMessage>) => {
      // Check event.origin to make sure it's from Dashibase
      if (!this.isFromDashibase(event.origin)) return
      // Make sure that it's from the same source
      if (event.source !== this.source) return
      // Make sure that it's the correct message ID
      if (event.data.id !== messageId) return
      // Handle SetDimensionsMessage
      if (event.data.messageType === MessageType.SET_DIM) {
        if (resolveMessage) {
          resolveMessage(event.data)
          controller.abort()
        }
      }
    }, {
      signal: controller.signal,
    })

    // Send the SetDimensionsMessage
    this.source.postMessage({
      id: messageId,
      messageType: MessageType.SET_DIM,
      height,
      width,
      resizable,
    } as SetDimensionsMessage, { targetOrigin: this.sourceOrigin })

    return new Promise<SetDimensionsMessage>(resolve => {
      resolveMessage = resolve as CallbackFunction
    })
  }

  /**
   * @param {string} key Key whose value is requested
   * 
   * This is used to request actual data from the dashboard.
   * For example, a plugin might retrieve a Stripe customer ID
   * by requesting the value of a particular column ID.
   * 
   * This returns a promise which should resolve to a
   * RespondMessage object containing the key and value.
   */
  request (key: string) {
    if (!this.source) throw Error('No EventSource found. Make sure you receive the Setup message first.')

    const controller = new AbortController()
    const messageId = randomAlphabetString(10)
    type CallbackFunction = (value: RespondMessage) => RespondMessage
    let resolveMessage: CallbackFunction|undefined = undefined

    // Listen for the RespondMessage
    window.addEventListener("message", (event: MessageEvent<RespondMessage>) => {
      // Check event.origin to make sure it's from Dashibase
      if (!this.isFromDashibase(event.origin)) return
      // Make sure that it's from the same source
      if (event.source !== this.source) return
      // Make sure that it's the correct message ID
      if (event.data.id !== messageId) return
      // Handle RespondMessage by resolving the promise
      if (event.data.messageType === MessageType.RESPOND) {
        if (resolveMessage) {
          resolveMessage(event.data)
          controller.abort()
        }
      }
    }, {
      signal: controller.signal,
    })

    // Send the RequestMessage
    this.source.postMessage({
      id: messageId,
      messageType: MessageType.REQUEST,
      key,
    } as RequestMessage, { targetOrigin: this.sourceOrigin })

    return new Promise<RespondMessage>(resolve => {
      resolveMessage = resolve as CallbackFunction
    })
  }

  /**
   * @param {string} key Key of key-value pair being persisted
   * @param {string} value Value of key-value pair being persisted
   * 
   * This is used to store a key-value pair on Dashibase, which
   * will be returned in the SetupMessage.store property the
   * next time the plugin is initialized.
   * 
   * This returns a promise which should resolve to the same
   * StoreMessage object upon successful storage.
   */
  store (key: string, value: any) {
    if (!this.source) throw Error('No EventSource found. Make sure you receive the Setup message first.')

    const controller = new AbortController()
    const messageId = randomAlphabetString(10)
    type CallbackFunction = (value: StoreMessage) => StoreMessage
    let resolveMessage: CallbackFunction|undefined = undefined

    // Listen for the reply StoreMessage which implies success
    window.addEventListener("message", (event: MessageEvent<StoreMessage>) => {
      // Check event.origin to make sure it's from Dashibase
      if (!this.isFromDashibase(event.origin)) return
      // Make sure that it's from the same source
      if (event.source !== this.source) return
      // Make sure that it's the correct message ID
      if (event.data.id !== messageId) return
      // Handle Respond message
      if (event.data.messageType === MessageType.STORE) {
        if (resolveMessage) {
          resolveMessage(event.data)
          controller.abort()
        }
      }
    }, {
      signal: controller.signal,
    })

    // Send the StoreMessage
    this.source.postMessage({
      id: messageId,
      messageType: MessageType.STORE,
      key,
      value,
    } as StoreMessage, { targetOrigin: this.sourceOrigin })

    return new Promise<StoreMessage>(resolve => {
      resolveMessage = resolve as CallbackFunction
    })
  }
}

