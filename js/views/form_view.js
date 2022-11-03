
import View from './view.js'

export default class FormView extends View {
    constructor(storageService, viewModel, parentView) {
        super(storageService, viewModel["form"])
        this.entityViewModel = viewModel;
        this.currentItemId = null;

        this.parentView = parentView; //reference to parent list view
        this.formChanged = false; //tracks if form changed
    }
    /* GETTERS AND SETTERS */
    get fields() {
        return this.viewModel.fields
    }
    get formId() {
        return this.viewModel.id;
    }
    get $form() {
        return $("#" + this.formId);
    }
    get form() {
        return this.$form.get(0);
    }
    get formValid() {
        return this.form.checkValidity();
    }
    get $inputs() {
        return $("#" + this.formId + " :input");
    }

    /*NOTE:  render is handled fully in the inherited View class*/

    /* getViewData-overrides parent method */
    async getViewData() {

        if (this.currentItemId) {
            return this.storage.read(this.currentItemId);
        }
        return {};
    }

    /*bindItemEvents()-override-bind form submit and cancel events*/
    async bindItemEvents() {

        $('#submitButton').on("click", (ev) => {
            this.submit(ev);
            return false;
        });
        $('#cancelButton').on("click", (ev) => {
            if (this.formChanged) {
                $('#cancelModal').modal('show');
            }
            else {
                this.parentView.closeEditModal();
            }
        });
        $('#cancelYesButton').on("click", () => {
            this.parentView.closeEditModal();
        })
        this.entityViewModel.form.fields.forEach((field) => {
            $(`#${field.name}-input`).on("change", (ev) => {
                this.change(document.getElementById(`${field.name}-input`));
                return false;
            });
        })




    }
    async bindWrapperEvents() { }  //needed for now so parent class doesn't complain.  

    /*submit method-handle the form submit event.  Must be an arrow function to 
    inherit the 'this' from the class*/
    submit = (ev) => {

        ev.preventDefault();
        ev.stopPropagation();

        if (document.getElementById(`${this.entityViewModel.form.id}`).checkValidity()) {
            console.log("form valid");


            let newObj = {}

            var myData = $(`#${this.entityViewModel.form.id}`).serializeArray();
            myData.forEach((field) => {
                let name = field.name
                newObj[name] = field.value
            });
            if (newObj.id) {
                this.storage.update(newObj.id, newObj).then(() => {
                    this.parentView.renderItem();
                    this.parentView.closeEditModal();
                });
            }
            else {
                this.storage.findHighestID().then((highestID) => {
                    newObj["id"] = highestID + 1;
                    this.storage.create(newObj).then(() => {
                        this.parentView.renderItem();
                        this.parentView.closeEditModal();
                        this.parentView.entityViewModel.data.push(newObj);
                    })
                })
            }
        }
    }

    /*getFormData()-get the data from the form an package as a normal object for submit*/
    getFormData() {
        return Object.fromEntries(new FormData(this.form));
        //reference: https://gomakethings.com/serializing-form-data-with-the-vanilla-js-formdata-object/

    }

    /*change()-change event handler for inputs.  call fieldValidated to set the bootstrap classes. Set formChanged*/
    change = input => {

        this.fieldValidated(input);
        this.formChanged = true;
    }

    getEventEl(ev) {
        return $(ev.currentTarget);
    }

    fieldValidated($el) {
        if ($el.checkValidity()) {
            $el.classList.remove("is-invalid");
            $el.classList.add("is-valid");
        } else {
            $el.classList.remove("is-valid");
            $el.classList.add("is-invalid");

        }
    }

    formValidated() {
        document.getElementById(`${this.entityViewModel.form.id}`).classList.add("was-validated");
    }

}