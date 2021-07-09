---
to: templates/<%= firstLower = name.charAt(0).toLowerCase() + name.substr(1) %>/<%= firstLower %>List.hbs
---

<ul>
    {{#each <%= firstLower %>.data}}
    <li>
        <a href="/<%= name.toLowerCase() %>/{{id}}">{{id}}</a>
        <form method="POST" action="/<%= name.toLowerCase() %>/{{id}}" data-roads-pjax="form">
            <input type="hidden" name="csrfToken" value="{{../csrfToken}}">
            <input type="hidden" name="methodOverride" value="DELETE" />
            <input type="submit" value="delete" data-roads-pjax="submit"/>
        </form>
    </li>
    {{/each}}
</ul>