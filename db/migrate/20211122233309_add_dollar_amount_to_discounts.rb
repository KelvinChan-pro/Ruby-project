class AddDollarAmountToDiscounts < ActiveRecord::Migration[6.0]
  def change
    add_column :discounts, :dollar_amount, :boolean, default: false
    add_column :discounts, :amount, :integer, default: 0
  end
end
