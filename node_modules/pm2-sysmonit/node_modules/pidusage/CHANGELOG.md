### 2.0.17

- allow to manually clear the event loop when needed it'll clear itself after a given timeout (default to `60000ms` but you can specify it with the `maxage` option, [see this file](https://github.com/soyuka/pidusage/blob/master/test/fixtures/eventloop.js#L3)) [1740a4f](https://github.com/soyuka/pidusage/commit/2779e520d3414a8318c86279cf14bebae3264604)
- fix elapsed and timestamp calculations on linux [#80](https://github.com/soyuka/pidusage/issues/80) [e5e2b01](https://github.com/soyuka/pidusage/commit/081984a04bc97ad8abd82315f936861cce1df0d6)

### 2.0.16

- fix ps on darwin, centisenconds multiplier was wrong and was giving bad cpu usage values [bcda538](https://github.com/soyuka/pidusage/commit/bcda538b76498c6d4bcaa36520238990554929c5)

### 2.0.15

- Fix Buffer.alloc for node < 4.5

### 2.0.14

- Version unpublished because of a publish mistake from my part due to a npm error message that confused me. Explanation [in isse #71](https://github.com/soyuka/pidusage/issues/72#issuecomment-407572581)

### 2.0.12

- fix #69 with `ps` use elapsed instead of etime to avoid negative cpu values [0994268](https://github.com/soyuka/pidusage/commit/0994268c297e23efa3d9052f24cbacf2cbe31629)
- fix typo in aix `ps` command #68 [7d55518](https://github.com/soyuka/pidusage/commit/7d55518b7d5d5aae964e64ddd7b13ecec75463a1)

### 2.0.10

- aix is using ps (was changed by mistake), still no aix CI though
- add alpine to the test suite and make it use procfile
- Improve procfile performances by keeping the procfile open [da1c5fb](https://github.com/soyuka/pidusage/commit/da1c5fb2480bdf8f871476d79161dac7733b89f3)

### 2.0.8

- After further discussion cpu formula got reverted to the initial one [f990f72](https://github.com/soyuka/pidusage/commit/f990f72fd185e4ba0a87048e6e6c59f814a016cc)


### 2.0.7

- Cpu formula changed a bit because of multi thread issues see [issue #58](https://github.com/soyuka/pidusage/issues/58) [88972d8](https://github.com/soyuka/pidusage/commit/88972d8cd38d4137b70261a830af22283b69c57c)

### 2.0.6

- procfiles are back because of performance issues [85e20fa](https://github.com/soyuka/pidusage/commit/85e20fa30aa9ff01d87d3ba9be7fec7f805fc5fb)

### 2.0

- allow multiple pids
- remove `advanced` option
- don't use `/proc` (procfiles) anymore but use `ps` instead
- more tests
- API change no more `stat` method, module exports a single function
- no more `unmonitor` method, this is handed internally
- the default call now returns more data:

```
{
  cpu: 10.0,            // percentage (it may happen to be greater than 100%)
  memory: 357306368,    // bytes
  ppid: 312,            // PPID
  pid: 727,             // PID
  ctime: 867000,        // ms user + system time
  elapsed: 6650000,     // ms since the start of the process
  timestamp: 864000000  // ms since epoch
}
```

### 1.2.0

Introduce `advanced` option to get time, and start

### 1.1.0

Windows: (wmic) goes back to the first version of wmic, naming `wmic process {pid} get workingsetsize,usermodetime,kernelmodetime`. CPU usage % is computed on the flight, per pid.

### 1.0.5

Windows: (wmic) Use raw data instead of formatted this should speed up wmic

### 0.1.0
API changes:
```
require('pidusage').stat(pid, fn)
```
instead of:
```
require('pidusage')(pid, fn)
```
Adds a `unmonitor` method to clear process history
