import Q from "q";

export default class Command {
  constructor(payload) {
    this._payload = payload;
    this._name = "Unnamed";
  }

  get name(){
    return this._name;
  }

  static is(text) {
    console.log(text);
    throw new Error("Not implemented");
  }

  get payload() {
    return this._payload;
  }

  set currentPromise(promise) {
    this._currentPromise = promise;
  }

  get currentPromise() {
    return this._currentPromise;
  }

  get chatId() {
    return this.payload.chat.id.toString();
  }

  run() {
    let deferred = Q.defer();

    deferred.resolve(this._buildPayload(this._payload.text));

    return deferred.promise;
  }

  _buildPayload(text) {
    let payloadId = new Date();
    let result = {
      id: +payloadId,
      text: text,
      chatId: this.payload.chat.id,
      replyToMessageId: this.payload.message_id
    };

    return result;
  }
}
