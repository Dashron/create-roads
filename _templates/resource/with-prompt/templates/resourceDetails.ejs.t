---
to: templates/<%= firstLower = name.charAt(0).toLowerCase() + name.substr(1) %>/<%= firstLower %>Details.hbs
---

{{#with <%= firstLower %>}}
<h1 class="title">{{id}}</h1>
{{/with}}