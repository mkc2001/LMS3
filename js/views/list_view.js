import View from './view.js'
import FormView from './form_view.js';

export default class ListView extends View {  //now inherits from 'View' class
    constructor(storageService, viewModel) {
        super(storageService, viewModel["list"])  //I take full view model and only pass the 'list' view model to the View constructor
        this.entityViewModel = viewModel;

    }
    /* GETTERS AND SETTERS 
    These are the ones I use and you are free to use them, or add some of your own.
    */
    get columns() {
        return this.viewModel.columns;
    } //get columns needed for table
    get $searchInput() {
        return $("#" + this.viewModel.searchInputId);
    }
    get $clearSearchButton() {
        return $("#" + this.viewModel.clearSearchButtonId);
    }
    get $newButton() {
        return $("#" + this.viewModel.newButtonId);
    }
    get $resetButton() {
        return $("#" + this.viewModel.resetButtonId);
    }
    get $deleteModal() {
        return $("#" + this.viewModel.deleteModalContainerId);
    }
    get $editModal() {
        return $("#" + this.viewModel.editModalContainerId);
    }
    get $headerIcon() {
        return $(`#${this.storage.sortCol}-${this.storage.sortDir}`)
    }
    get popoversEnabled() {
        return this.viewModel.enablePopovers
    }
    get formView() { return this._formView; }
    get entityName() {  //this getter gives me entity name with first letter capitalized
        let str = this.entityViewModel.entitySingle;
        return str[0].toUpperCase() + str.substring(1);
    }
    /* getViewData-overrides parent method */
    async getViewData() { //override from View.js
        return await this.storage.list();
    }

    /*editItem(itemId)-Instantiate form view to edit current item
    This is called from the event handler set in the bindItemEvents*/
    async editItem(itemId) {

        let form = new FormView(this.storage, this.entityViewModel, this);
        form.currentItemId = itemId;
        form.renderItem();
    }

    /*createItem()-create new item.  Pass in null for id
    This is called from the event handler set on the 'new' button in the bindWrapperEvents*/
    async createItem() {
        this.editItem(null);  //just call editItem with a null id, that should tell the form view to do an 'add'
    }

    /*bindItemEvents()-bind edit and sort column events. Initialize sort and popover*/
    async bindItemEvents(data) {
        let that = this;

        this.entityViewModel.data.forEach((item) => {
            $(`#edit-${item.id}`).click((ev) => {
                this.editItem(item.id);
            });
        });

        this.columns.forEach((header) => {
            let $header = $(`#${header.name}`);
            $header.on("click", (ev) => {
                if (this.viewModel.options.sortCol == header.name) {
                    if (this.viewModel.options.sortDir == "asc") {
                        $(`${header.name}-asc`).css("display", "none");
                        $(`${header.name}-desc`).css("display", "inline");
                        this.viewModel.options.sortDir = "desc";
                        this.storage.options = {
                            sortCol: `${header.name}`,
                            sortDir: "desc",
                            filterCol: "",
                            filterStr: ""
                        }
                    } else {
                        this.viewModel.options.sortDir = "asc";
                        this.storage.options = {
                            sortCol: `${header.name}`,
                            sortDir: "asc",
                            filterCol: "",
                            filterStr: ""
                        }
                    }
                } else {
                    $(`${this.viewModel.options.sortCol}-${this.viewModel.options.sortDir}`)
                        .css("display", "none");
                    $(`${header.name}-asc`).css("display", "inline");
                    this.viewModel.options.sortCol = `${header.name}`
                    this.viewModel.options.sortDir = "asc";
                    this.storage.options = {
                        sortCol: `${header.name}`,
                        sortDir: "asc",
                        filterCol: "",
                        filterStr: ""
                    }
                }
                this.render();
            })
        })
        this.initPopover();

    }

    /*bindWrapperEvents()-Bind reset, delete and search events */
    async bindWrapperEvents() {

        let $myModal = this.$deleteModal;


        $(`#createButton`).click((ev) => {
            this.createItem();
        });
        $myModal.on("show.bs.modal", function (ev) {  //fired when modal is about to be shown
            var button = ev.relatedTarget
            var teamName = button.getAttribute('data-name');
            var teamId = button.getAttribute('data-id');
            $myModal.attr("data-name", teamName);
            $myModal.attr("data-id", teamId);


            var $modalTitle = $('.modal-title')
            var $modalBody = $('.modal-body')

            $modalTitle.text(`Delete ${teamName}?`);
            $modalBody.text(`Are you sure you want to delete ${teamName}? This action is unreversable.`)
        });

        $("#yesButton").click((e) => {    //fired when 'Yes' button is clicked
            let itemName = $myModal.attr("data-name");    //get item name and id from modal attribute set in show.bs.modal event
            let itemId = $myModal.attr("data-id");

            this.addAlert(this.entityViewModel.entitySingle, itemName);   //insert an alert in 'alertContainer'

            this.deleteListItem(itemId)
                .then(this.render());

        })


        $('#resetView').on("click", (e) => {
            this.reset();
        });
        $('#searchInput').on("input", (e) => {

            this.searchVal = $(e.target).val();
            this.runSearch();
        });
        $('#clearSearch').off("click").on("click", (e) => {
            this.clearSearch();
        });
    }

    /*closeEditModal-close the edit modal,called by form*/
    closeEditModal() {
        this.$editModal.modal("hide")
    }

    /*clearSearch-clear search input and storage filter, re-render
    TODO-simply integrate your search functions
    */
    clearSearch() {
        $('#searchInput').val("");
        this.storage.filterStr = "";
        this.renderItem();
    }
    clearSearchInput() {
    }
    /*runSearch-run search on 250 ms timeout, set storage filter and render*/
    runSearch() {
        clearTimeout(this.searchWaiter);
        this.searchWaiter = setTimeout(() => {
            if (this.searchVal.length > 1) {
                this.storage.filterStr = this.searchVal;
                this.storage.filterCol = this.storage.sortCol;
                this.renderItem();

            }
            if (this.searchVal.length == 0) {
                this.clearSearch();
            }
        }, 250);
    }
    async deleteListItem(id) {
        await this.storage.delete(id);
        await this.renderItem();
    }

    addAlert(itemType, itemName) {
        let alertHtml = `<div id="deleteAlert" class="alert alert-warning alert-dismissible fade show w-50" role="alert">
                            <strong>You deleted the following ${itemType}: ${itemName}</span>
                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>`;
        this.$alertContainer.html(alertHtml);
    }

    /*initPopover-initialize popover*/
    initPopover() {
        $('[data-toggle="popover"]').popover({
            delay: { show: 500 }
        });
    }

    /*UTILITY FUNCTIONS-You can use these if you want*/
    /*hideSortIcons-hide the sort up and down arrows*/
    hideSortIcons() {
        $(".toggleIcon").hide();
    }
    /*showSortIcon/hideSortIcon-hide/show the sort up and down arrows given col and direction*/
    showSortIcon(col, dir) {
        $(`#${col}-${dir}`).show();
    }
    hideSortIcon(col, dir) {
        $(`#${col}-${dir}`).hide();
    }


}