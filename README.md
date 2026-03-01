# Jodel City Frontend

not the actual production repo, just a static version of the frontend that might be able to be used for collaboration/PRs

(if the HTML part and the logic isn't changing very much then patches for this repo should probably apply to the production repo, too)

## Develop

```
$ python3 -m http.server 8000
Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/) ...
```

then go to http://0.0.0.0:8000/#!home

With this you can only look at it, all the XHRs and websockets are failing and there's no messages…

but I could imagine writing a little proxy in this repo that proxies such requests upstream to jodel.city servers but serves the frontend from here - PR?
