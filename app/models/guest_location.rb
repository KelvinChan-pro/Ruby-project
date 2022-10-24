class GuestLocation < ApplicationRecord
  belongs_to :booking

  def to_index_res
      {
          id: self.id,
          address: self.address,
          city: self.city,
          state: self.state,
          zip: self.zip,
          lake_name: self.lake_name,
          full_name: full_name,
          full_address: full_address,
      }
  end

  def full_name
  	self.lake_name
  end

  def full_address
       "#{self.address || ''} #{self.city || ''} #{self.state || ''} #{self.zip || ''}"
    end
end
