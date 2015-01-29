    /**
     * @ngdoc model
     * @name ProductAttributeDisplay
     * @function
     *
     * @description
     * Represents a JS version of Merchello's ProductDisplay object
     */
    var ProductDisplay = function() {
        var self = this;
        self.key = '';
        self.productVariantKey = '';
        self.versionKey = '';
        self.name = '';
        self.sku = '';
        self.price = 0.00;
        self.costOfGoods = 0.00;
        self.salePrice = 0.00;
        self.onSale = false;
        self.manufacturer = '';
        self.manufacturerModelNumber = '';
        self.weight = 0;
        self.length = 0;
        self.width = 0;
        self.height = 0;
        self.barcode = "";
        self.available = true;
        self.trackInventory = false;
        self.outOfStockPurchase = false;
        self.taxable = false;
        self.shippable = false;
        self.download = false;
        self.downloadMediaId = -1;
        self.productOptions = [];
        self.productVariants = [];
        self.catalogInventories = [];
    };

    ProductDisplay.prototype = (function() {

        // returns a product variant with the associated key
        function getProductVariant(productVariantKey) {
            return _.find(this.productVariants, function(v) { return v.key === productVariantKey});
        }

        // returns a value indicating whether or not the product has variants
        function hasVariants() {
            return this.productVariants.length > 0;
        }

        // gets the master variant that represents a product without variants
        function getMasterVariant() {
            var variant = new ProductVariantDisplay();
            angular.extend(variant, this);
            // clean up
            variant.key = this.productVariantKey;
            variant.productKey = this.key;
            delete variant['productOptions'];
            delete variant['productVariants'];
            return variant;
        }

        // returns a count of total inventory. if product has variants sums all inventory otherwise uses
        // the product inventory count
        function totalInventory() {
            var inventoryCount = 0;
            if (hasVariants.call(this)) {
                angular.forEach(this.productVariants, function(pv) {
                    angular.forEach(pv.catalogInventories, function(ci) {
                        inventoryCount += ci.count;
                    });
                });
            } else {
                angular.forEach(this.catalogInventories, function(ci) {
                  inventoryCount += ci.count;
                });
            }
            return inventoryCount;
        }

        function addEmptyOption() {
            var option = new ProductOptionDisplay();
            this.productOptions.push(option);
        }

        function removeOption(option) {
            this.productOptions = _.reject(this.productOptions, function(opt) { return _.isEqual(opt, option); });
        }

        function variantsMinimumPrice(salePrice) {
            if (this.productVariants.length > 0) {
                if (salePrice === undefined) {
                    return _.min(this.productVariants, function(v) { return v.price; }).price;
                } else {
                    return _.min(this.productVariants, function(v) { return v.salePrice; }).salePrice;
                }
            } else {
                return 0;
            }
        }

        function variantsMaximumPrice(salePrice) {
            if (this.productVariants.length > 0) {
                if(salePrice === undefined) {
                    return _.max(this.productVariants, function(v) { return v.price; }).price;
                } else {
                    return _.max(this.productVariants, function(v) { return v.salePrice; }).salePrice;
                }
            } else {
                return 0;
            }
        }

        function anyVariantsOnSale() {
            var variant = _.find(this.productVariants, function(v) { return v.onSale; });
            return variant === undefined ? false : true;
        }

        function shippableVariants() {
            return _.filter(this.productVariants, function(v) { return v.shippable; });
        }

        return {
            hasVariants: hasVariants,
            totalInventory: totalInventory,
            getMasterVariant: getMasterVariant,
            addEmptyOption: addEmptyOption,
            removeOption: removeOption,
            variantsMinimumPrice: variantsMinimumPrice,
            variantsMaximumPrice: variantsMaximumPrice,
            anyVariantsOnSale: anyVariantsOnSale,
            shippableVariants: shippableVariants,
            getProductVariant: getProductVariant
        };
    }());

    angular.module('merchello.models').constant('ProductDisplay', ProductDisplay);