//Storage Controller
const StorageCtrl = (function(){
    return {
        storeItem: function(item){
            let items;
            
            //check if any items in ls
            if(localStorage.getItem('items') === null){
                items = [];
                items.push(item);
                localStorage.setItem('items', JSON.stringify(items));
            }else{
                items = JSON.parse(localStorage.getItem('items'));
                items.push(item);
                localStorage.setItem('items', JSON.stringify(items));
            }
        },
        getItemsFromStorage: function(){
            let items;
            if(localStorage.getItem('items') === null){
                items = [];
            }else{
                items = JSON.parse(localStorage.getItem('items'));    
            }
            return items;
        },
        updateItemStorage: function(updatedItem){
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function(item, index){
                if(updatedItem.id === item.id){
                    items.splice(index, 1, updatedItem);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        deleteItemFromStorage: function(id){
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function(item, index){
                if(id === item.id){
                    items.splice(index, 1);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        clearItemsFromStorage: function(){
            localStorage.removeItem('items');
        }
    }
})();

//Item Controller
const ItemCtrl = (function(){
    //Item Constructor
    const Item = function(id, name, calories){
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    //Data Structure / State
    const data = {
        // items: [
        //     // {id: 0, name: 'Chicken Dinner', calories: 1200},
        //     // {id: 1, name: 'Cookie', calories: 200},
        //     // {id: 2, name: 'Soup', calories: 300},
        // ],
        items: StorageCtrl.getItemsFromStorage(),
        currentItem: null,
        totalCalories: 0
    }

    return {
        getItems: function(){
            return data.items;
        },
        addItems: function(name, calories){
            let ID;
            //Create ID
            if(data.items.length > 0){
                ID = data.items[data.items.length - 1].id + 1;
            }else{
                ID = 0;
            }

            //Calories to number
            calories = parseInt(calories);

            //Create new item
            newItem = new Item(ID, name, calories);

            //Add to items array
            data.items.push(newItem);

            return newItem;
        },

        
        getItemById: function(id){
            let found = null;
            data.items.forEach(function(item){
                if(item.id === id){
                    found = item;
                }
            });
            return found;
        },

        updateItem: function(name, calories){
            //Calories tp number
            calories = parseInt(calories);

            let found = null;

            data.items.forEach(function(item){
                if(item.id === data.currentItem.id){
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });
            return found;
        },

        deleteItem: function(id){
            //Get ids
            const ids = data.items.map(function(item){
                return item.id;
            });
            
            //Get index
            const index = ids.indexOf(id);

            //Remove item
            data.items.splice(index, 1);
        },

        clearAllItems: function(){
            data.items = [];
        },
        setCurrentItem: function(item){
            data.currentItem = item;
        },

        getCurrentItem: function(){
            return data.currentItem;
        },
        
        
        getTotalCalories: function(){
            let total = 0;

            data.items.forEach(function(item){
                total += item.calories;
            });

            data.totalCalories = total;
            
            return data.totalCalories;
        },
        
        logData: function(){
            return data;
        }
    }
})();

//UI Controller
const UICtrl = (function(){

    const UISelectors = {
        itemList: '#item-list',
        listItems: '#item-list li',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        clearBtn: '.clear-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories'
    }
    return {
        populateItemList: function(items){
            let html = '';

            items.forEach(function(item){
                html += `<li class="collection-item" id="item-${item.id}">
                <strong>${item.name}: </strong> 
                <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
            </li>`;
            });

            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getItemInput: function(){
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        
        addListItem: function(item){
            //Show the list
            document.querySelector(UISelectors.itemList).style.display = 'block';
            //Create li element
            const li = document.createElement('li');
            li.className = 'collection-item';
            li.id = `item-${item.id}`;

            //Add html
            li.innerHTML = `<strong>${item.name}: </strong> 
            <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`;
            //Insert item
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
        },
        
        updateListItem: function(item){
            let listItems = document.querySelectorAll(UISelectors.listItems);

            //Turn node list into array
            listItems = Array.from(listItems);

            listItems.forEach(function(listItem){
                const itemID = listItem.getAttribute('id');

                if(itemID === `item-${item.id}`){
                    document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}: </strong> 
                    <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                        <i class="edit-item fa fa-pencil"></i>
                    </a>`;
                }
            });

        },
        
        deleteListItem: function(id){
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);
            item.remove();
        },
        clearInput: function(){
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },
        addItemToForm: function(){
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },
        removeItems: function(){
            let listItems = document.querySelectorAll(UISelectors.listItems);

            //Turn nodelist into array
            listItems = Array.from(listItems);

            listItems.forEach(function(listItem){
                listItem.remove();
            });
        },
        hideList: function(){
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        showTotalCalories: function(total){
            document.querySelector(UISelectors.totalCalories).textContent = total;
        },
        clearEditState: function(){
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';

        },
        showEditState: function(){
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';

        },
        getSelectors: function(){
            return UISelectors;
        }
    }
})();

//App Controller
const AppCtrl = (function(ItemCtrl, StorageCtrl, UICtrl){
    //Load event listeners
    const loadEventListeners = function(){
        //Get UI selectors
        const UISelectors = UICtrl.getSelectors();

        //Add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

        //Disable submit on enter
        document.addEventListener('keypress', function(e){
            if(e.keyCode === 13 || e.which === 13){
                e.preventDefault();
                return false;
            }
        })

        //Edit icon click event
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

        //Update item event
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

        //Back item event
        document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);

        //delete item event
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

        //Clear item event
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);

    }

    //Add item submit
    const itemAddSubmit = function(e){
        //get form input from UI Controller
        const input = UICtrl.getItemInput();

        if(input.name !== '' && input.calories !== ''){
            
            //Add iem
            const newItem = ItemCtrl.addItems(input.name, input.calories);

            //Add Item to UI list
            UICtrl.addListItem(newItem);

            //Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();

            //Add total calories to UI
            UICtrl.showTotalCalories(totalCalories);

            //Store in ls
            StorageCtrl.storeItem(newItem);

            //Clear fields
            UICtrl.clearInput();

            
        }

        e.preventDefault();
    }

    //Click edit item 
    const itemEditClick = function(e){
        if(e.target.classList.contains('edit-item')){
            //Get list item id(item-0)
            const listId = e.target.parentNode.parentNode.id;

            //break into an array [item, 0]
            const listIdArray = listId.split('-');

            //Get actual id
            const id = parseInt(listIdArray[1]);
            
            //Get item
            const itemToEdit = ItemCtrl.getItemById(id);

            //Set to current item
            ItemCtrl.setCurrentItem(itemToEdit);
            //console.log(ItemCtrl.logData());

            //Add item to form
            UICtrl.addItemToForm();
        }
        e.preventDefault();
    }

    //Add update submit
    const itemUpdateSubmit = function(e){
        //Get item input
        const input = UICtrl.getItemInput();

        //update item
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

        //Update UI
        UICtrl.updateListItem(updatedItem);

        //Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();

        //Add total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        //Update ls
        StorageCtrl.updateItemStorage(updatedItem);
        //Clear fields
        UICtrl.clearEditState();
        
        e.preventDefault();
    }

    //Click delete submit
    const itemDeleteSubmit = function(e){
        //Get current item
        const currentItem = ItemCtrl.getCurrentItem();

        //delete from ds
        ItemCtrl.deleteItem(currentItem.id);

        //delete from UI
        UICtrl.deleteListItem(currentItem.id);

        //Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();

        //Add total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        //Delete from ls
        StorageCtrl.deleteItemFromStorage(currentItem.id);

        //Clear fields
        UICtrl.clearEditState();

        e.preventDefault();
    }

    //CLear all items event
    const clearAllItemsClick = function(){
        //Delete all items from ds
        ItemCtrl.clearAllItems();

        //Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();

        //Add total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        //delete from UI
        UICtrl.removeItems();

        //Remove from ls
        StorageCtrl.clearItemsFromStorage();

        //Hide ui
        UICtrl.hideList();
        
    }
    return {
        init: function(){
            //Set initial state
            UICtrl.clearEditState();
            const items = ItemCtrl.getItems();

            //Check if any items
            if(items.length === 0){
                UICtrl.hideList();
            }else{
                UICtrl.populateItemList(items); 
            }
            
            //Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();

            //Add total calories to UI
            UICtrl.showTotalCalories(totalCalories);

            //Load event listeners
            loadEventListeners();

        }
    }
})(ItemCtrl, StorageCtrl, UICtrl);

//Initializing App
AppCtrl.init();

