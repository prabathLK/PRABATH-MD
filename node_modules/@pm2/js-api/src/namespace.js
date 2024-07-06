
'use strict'

const Endpoint = require('./endpoint')
const logger = require('debug')('kmjs:namespace')

module.exports = class Namespace {
  constructor (mapping, opts) {
    logger(`initialization namespace ${opts.name}`)
    this.name = opts.name
    this.http = opts.http
    this.endpoints = []
    this.namespaces = []

    logger(`building namespace ${opts.name}`)
    for (let name in mapping) {
      let child = mapping[name]
      if (typeof mapping === 'object' && !child.route) {
        // ignore the 'default' namespace that should bind to the parent namespace
        if (name === 'default') {
          // create the namespace
          const defaultNamespace = new Namespace(child, { name, http: this.http, services: opts.services })
          this.namespaces.push(defaultNamespace)
          // bind property of the default namespace to this namespace
          for (let key in defaultNamespace) {
            if (key === 'name' || key === 'opts') continue
            this[key] = defaultNamespace[key]
          }
          continue
        }
        // if the parent namespace is a object, the child are namespace too
        this.addNamespace(new Namespace(child, { name, http: this.http, services: opts.services }))
      } else {
        // otherwise its an endpoint
        if (child.service && opts.services && opts.services[child.service.name]) {
          child.service.baseURL = opts.services[child.service.name]
        }
        this.addEndpoint(new Endpoint(child))
      }
    }

    // logging namespaces
    if (this.namespaces.length > 0) {
      logger(`namespace ${this.name} contains namespaces : \n${this.namespaces.map(namespace => namespace.name).join('\n')}\n`)
    }

    // logging endpoints
    if (this.endpoints.length > 0) {
      logger(`Namespace ${this.name} contains endpoints : \n${this.endpoints.map(endpoint => endpoint.route.name).join('\n')}\n`)
    }
  }

  addNamespace (namespace) {
    if (!namespace || namespace.name === this.name) {
      throw new Error(`A namespace must not have the same name as the parent namespace`)
    }
    if (!(namespace instanceof Namespace)) {
      throw new Error(`addNamespace only accept Namespace instance`)
    }

    this.namespaces.push(namespace)
    this[namespace.name] = namespace
  }

  addEndpoint (endpoint) {
    if (!endpoint || endpoint.name === this.name) {
      throw new Error(`A endpoint must not have the same name as a namespace`)
    }
    if (!(endpoint instanceof Endpoint)) {
      throw new Error(`addNamespace only accept Namespace instance`)
    }

    this.endpoints.push(endpoint)
    this[endpoint.name] = endpoint.build(this.http)
  }
}
