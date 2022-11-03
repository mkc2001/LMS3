import Utils from '../util/utilities.js'
export default class View {
    constructor(storage, viewModel) {
        this.storage = storage;
        this.viewModel = viewModel;
        this.utils = new Utils();
        this.data = null;
    }
    get $alertContainer() {
        return $("#" + this.viewModel.alertContainerId);
    }
    get wrapperTemplateUrl() {
        return this.viewModel.wrapperTemplateUrl;
    }
    get hasWrapper() {
        return this.viewModel.wrapperTemplateUrl;
    }
    get $wrapperContainer() {
        return $("#" + this.viewModel.wrapperContainerId);
    }
    get $container() {
        return $("#" + this.viewModel.containerId);
    }
    get templateUrl() {
        return this.viewModel.templateUrl;
    }
    get $headerIcon() {
        return $(`#${this.storage.sortCol}-${this.storage.sortDir}`)
    }

    async render() {
        // render the wrapper first, then the item
        this.renderWrapper().then(() => {
            this.renderItem();
        })
    }

    async renderTemplate($container, templateUrl, viewData) {
        //hide the container
        $container.empty().hide();

        /*TODO perform generic template render here using passed in viewData
         */
        let templateHtml =
            await this.utils.getFileContents(templateUrl);

        $container.html(ejs.render(templateHtml, viewData));
        //show the container
        $container.show()
    }

    async renderWrapper() {

        this.data = await this.getViewData();

        let viewData = {
            view: this,   //pass in the view itself so you can use view functions if you want
            viewModel: this.viewModel,
            data: this.data,
        }
        await this.renderTemplate(this.$wrapperContainer, this.wrapperTemplateUrl, viewData);
        this.bindWrapperEvents();


    }
    async renderItem() {

        this.data = await this.getViewData();
        let viewData = {
            view: this,
            viewModel: this.viewModel,
            data: this.data
        }

        await this.renderTemplate(this.$container, this.templateUrl, viewData);
        this.$headerIcon.css("display", "inline");

        this.bindItemEvents();

    }

    async getViewData() {
        throw new Error("must implement getViewData in sub class!")
    }
    async reset() {
        await this.storage.reset();
        await this.render();
    }

    async bindItemEvents() {
        throw new Error("must implement bindItemEvents in sub class!")
    }
    async bindWrapperEvents() {
        throw new Error("must implement bindWrapperEvents in sub class!")
    }

    /*readCachedItem()
    special function I added to get the currently cached item instead of reading it anew
    this will be more important later when we are reading from an API.  I don't want to go all the
    way out to the internet to get a value that is sitting in memory.
    I use it when rendering the popover and delete modal when the latest information is not really needed
    */
    readCachedItem(id) {
        return this.storage.getItem(id);
    }
}