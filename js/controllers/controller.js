class AppController {
    constructor(appViewModel) {
        this.appViewModel = appViewModel;
        //create a local storage service instance using mockData found in 'data' element of view model (see getter)
        this.storageService = new LocalStorageService(this.data, this.entity, this.list.options);

        //create a ListPageView class, passing in the storage service and view model
        this._view = new ListPageView(this.storageService, this.listViewModel)

    }
    get data() { return this.appViewModel.viewModel.data; }
    get entity() { return this.appViewModel.viewModel.entity; }
    get list() { return this.appViewModel.viewModel.list; }
    get listViewModel() { return this.appViewModel.viewModel; }

    get view() {
        return this._view;
    }
    async reset() {
        await this.view.reset();
    }
    async render() {
        await this.view.render();
    }

}