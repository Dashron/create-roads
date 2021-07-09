---
to: templates/<%= firstLower = name.charAt(0).toLowerCase() + name.substr(1) %>/<%= firstLower %>Index.hbs
---

<h1 class="title">Your <%= firstLower %></h1>
{{{<%= firstLower %>List}}}
{{{add<%= name %>Element}}}

