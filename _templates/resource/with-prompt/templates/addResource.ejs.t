---
to: templates/<%= firstLower = name.charAt(0).toLowerCase() + name.substr(1) %>/add<%= name %>.hbs
---

<div class="box">
    <form id="add<%= name %>Form" method="POST" action="//www.dungeondashboard.com/<%= name.toLowerCase() %>" data-roads-pjax="form">
        <input type="hidden" value="{{csrfToken}}" name="csrfToken" />

        {{!-- <div class="field">
            <label class="label">Name</label>
            <div class="control {{#if formData.[/name].invalid}}has-icons-right{{/if}}">
                <input name="name" class="input {{#if formData.[/name].invalid}}is-danger{{/if}}" type="text" placeholder="Text input" value="{{formData.[/name].value}}">
                {{#if formData.[/name].invalid}}
                    <span class="icon is-small is-right">
                        <i class="fas fa-exclamation-triangle"></i>
                    </span>
                    <p class="help is-danger">            
                        {{#each formData.[/name].problems}}
                            {{this}}<br />
                        {{/each}}
                    </p>
                {{/if}}
            </div>
        </div> --}}
        
        <div class="field is-grouped">
            <div class="control">
                <button class="button is-link" data-roads-pjax="submit" id="add<%= name %>">Add <%= name %></button>
            </div>
        </div>
    </form>
</div>