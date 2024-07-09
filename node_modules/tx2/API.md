## Classes

<dl>
<dt><a href="#TX2">TX2</a></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#Metric">Metric</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#Counter">Counter</a> : <code>object</code></dt>
<dd><p>Expose a metric of type: Counter.</p>
</dd>
</dl>

<a name="TX2"></a>

## TX2
**Kind**: global class  

* [TX2](#TX2)
    * [.action(action_name, [opts], fn)](#TX2.action)
    * [.event(name, data)](#TX2.event)
    * [.issue(err)](#TX2.issue)
    * [.metric(name, [function])](#TX2.metric) ⇒ [<code>Metric</code>](#Metric)
    * [.counter(name)](#TX2.counter) ⇒ [<code>Counter</code>](#Counter)

<a name="TX2.action"></a>

### TX2.action(action_name, [opts], fn)
Expose an action/function triggerable via PM2 or PM2.io

**Kind**: static method of [<code>TX2</code>](#TX2)  

| Param | Type | Description |
| --- | --- | --- |
| action_name | <code>string</code> | Name of the action |
| [opts] | <code>object</code> | Optional parameter |
| fn | <code>function</code> | Function to be called |

**Example** *(Action without arguments)*  
```js
tx2.action('run_query', (cb) => {
  cb({ success: true })
})
```
**Example** *(Action with arguments)*  
```js
tx2.action('run_query', arg1, (cb) => {
  cb({ success: arg1 })
})
```
<a name="TX2.event"></a>

### TX2.event(name, data)
Sends an Event

**Kind**: static method of [<code>TX2</code>](#TX2)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Name of the event |
| data | <code>object</code> | Metadata attached to the event |

**Example**  
```js
tx2.event('event-name', { multi: 'data' })
```
<a name="TX2.issue"></a>

### TX2.issue(err)
Sends an Issue

**Kind**: static method of [<code>TX2</code>](#TX2)  

| Param | Type | Description |
| --- | --- | --- |
| err | <code>string</code> \| <code>Error</code> | Error object or string to notify |

**Example**  
```js
tx2.issue(new Error('bad error')
```
<a name="TX2.metric"></a>

### TX2.metric(name, [function]) ⇒ [<code>Metric</code>](#Metric)
Expose a Metric

**Kind**: static method of [<code>TX2</code>](#TX2)  
**Returns**: [<code>Metric</code>](#Metric) - A metrics object  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Name of the metric |
| [function] | <code>function</code> | Optional function to trigger every second to retrieve updated value |

**Example**  
```js
tx2.metric('metric_name', () => obj.value)
```
**Example**  
```js
tx2.metric('metric_name', 'unit', () => obj.value)
```
**Example**  
```js
let mn = tx2.metric('metric_name')
mn.set(20)
```
<a name="TX2.counter"></a>

### TX2.counter(name) ⇒ [<code>Counter</code>](#Counter)
Expose a Metric of type: Counter. By calling .inc() or .dec() you update that value

**Kind**: static method of [<code>TX2</code>](#TX2)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Name of the Metric |

<a name="Metric"></a>

## Metric : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| val | <code>function</code> | Return the current value |
| set | <code>function</code> | Set value |

<a name="Counter"></a>

## Counter : <code>object</code>
Expose a metric of type: Counter.

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| inc | <code>function</code> | Increment value |
| dev | <code>function</code> | Decrement value |

