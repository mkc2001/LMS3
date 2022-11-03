import mockTeamData from '../../models/mock/mock_team_data.js'

var teamViewModel = {
    entity: "teams",           //key used for LocalStorage
    entitySingle: "team",      //singular in case you need for alert message

    data: mockTeamData,          //mock data we are going to use for now, global (included from js/models/mock_team_data.js)
    list: {
        deleteModalContainerId: "deleteModal",
        editModalContainerId: "formModal",
        alertContainerId: "alertContainer",   //container to store dismissible alert
        wrapperContainerId: "teamPageWrapper",
        wrapperTemplateUrl: "js/views/partials/list_view_wrapper.ejs",
        templateUrl: "js/views/partials/list_view.ejs",
        containerId: "tableContainer",
        searchInputId: "searchInput",
        resetButtonId: "resetView",
        newButtonId: "newButton",
        clearSearchButtonId: "clearSearch",
        options: {                 //default options sent to LocalStorageService
            sortCol: "name",
            sortDir: "asc",
            limit: "",
            offset: "",
            filterCol: "",
            filterStr: ""
        },
        listTitle: "Teams",

        id: "my-list",
        tableClasses: "table table-dark table-hover mt-2",   //classes for table tag
        thClasses: "bg-black bg-gradient",                    //classes for my th tags (you may not need)

        logoCol: "teamPhoto",                                //what data column holds the path to the team logo (if used in your code)
        nameCol: "name",                                     //what data column do we use to display the item 'name'
        /*Columns to be displayed in your bootstrap table.  I used 'popover=true' to indicate I wanted to include that colum in my popover.
        This allowed me to keep my code 'generic'*/
        enablePopovers: true,
        columns: [
            {
                label: "Team Name",
                name: "name",
                popover: "true"            //true if you want to show in popover
            },
            {
                label: "Coach Name",
                name: "coachName",
                popover: "true"
            },
            {
                label: "Coach Email",
                name: "coachEmail",
                popover: "true"
            }, {
                label: "Coach Phone",
                name: "coachPhone",
                popover: "true"
            }
        ]
    },
    form: {
        id: "team-form",      //form id, write as form 'id' attribute
        wrapperContainerId: "",  //none defined for now. modal is in the list_view_wrapper.ejs
        wrapperTemplateUrl: "",

        templateUrl: "js/views/partials/form_view.ejs",
        containerId: "formContainer",

        addFormTitle: "Add Team",      //title when adding new item (currentItemId==false)
        editFormTitle: "Edit Team",

        actionUrl: "",   //actionUrl and method aren't really used in our context, but we default them
        method: "POST",

        fields: [
            {
                //'id' field is required on the form and will be hidden
                label: "id",
                name: "id",
                tag: "input",
                defaultValue: "",
                attributes: {
                    type: "hidden",
                },
                validation: {
                    required: false,
                }
            },
            {
                label: "Team Name",
                name: "name",             //name field, write this as both name and id
                tag: "input",             //tag type
                defaultValue: "",          //default value of input, 'value' tag will get either data being edited or default value
                //attributes is a simple associative array containing any additional attributes you wish to add during render
                attributes: {
                    type: "text",
                    placeholder: "Enter your Team name here",
                    class: "form-control"
                },
                //validation rules.  If required, write the requiredMessage into the .invalid-feedback div
                validation: {
                    required: true,
                    requiredMessage: "Team Name is required"
                }
            },
            {
                label: "Coach Name",
                name: "coachName",
                tag: "input",
                defaultValue: "",
                attributes: {
                    type: "text",
                    placeholder: "Coach name",
                    class: "form-control"
                },
                validation: {
                    required: true,
                    requiredMessage: "Coach Name is required"
                }
            },
            {
                label: "Coach Phone",
                name: "coachPhone",
                tag: "input",
                defaultValue: "",
                attributes: {
                    type: "text",
                    placeholder: "Coach phone",
                    //pattern will allow you to customize your validation.
                    pattern: '[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}',
                    //use the title tag to explain the format required
                    title: 'Phone Number (Format: +1 (999)999-9999)',
                    class: "form-control"
                },
                validation: {
                    required: true,
                    requiredMessage: "Coach Phone is required"
                }
            },
            {
                label: "Coach Email",
                name: "coachEmail",
                tag: "input",
                defaultValue: "",
                attributes: {
                    type: "email",
                    placeholder: "Coach Email",
                    class: "form-control"
                },
                validation: {
                    required: true,
                    requiredMessage: "Coach Email is required"
                }
            },
            {
                label: "Team Notes",
                name: "notes",
                tag: "input",
                defaultValue: "",
                attributes: {
                    type: "text",
                    placeholder: "Enter your Team notes here",
                    class: "form-control"
                },
                validation: {
                    required: false
                }

            }
        ]

    },

}
export default teamViewModel;