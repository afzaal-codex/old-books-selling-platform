{/* BOOK TYPE */}

<div>
  <label className="mb-2 block text-sm font-semibold text-gray-700">
    Book Type
  </label>

  <select
    name="bookType"
    value={
      formData.bookType
    }
    onChange={handleChange}
    className="w-full rounded-2xl border border-gray-200 px-5 py-4 outline-none"
  >
    <option value="New">
      New
    </option>

    <option value="Old">
      Old
    </option>
  </select>
</div>

{/* CONDITION DETAILS */}

{formData.bookType ===
  "Old" && (
  <div>
    <label className="mb-2 block text-sm font-semibold text-gray-700">
      Book Condition
    </label>

    <input
      type="text"
      name="conditionDetails"
      placeholder="Like New, Slightly Used..."
      value={
        formData.conditionDetails
      }
      onChange={
        handleChange
      }
      className="w-full rounded-2xl border border-gray-200 px-5 py-4 outline-none"
    />
  </div>
)}

{/* BINDING */}

<div>
  <label className="mb-2 block text-sm font-semibold text-gray-700">
    Binding Type
  </label>

  <select
    name="bindingType"
    value={
      formData.bindingType
    }
    onChange={handleChange}
    className="w-full rounded-2xl border border-gray-200 px-5 py-4 outline-none"
  >
    <option value="Paperback">
      Paperback
    </option>

    <option value="Hard Binding">
      Hard Binding
    </option>

    <option value="Leather Binding">
      Leather Binding
    </option>

    <option value="Spiral Binding">
      Spiral Binding
    </option>
  </select>
</div>

{/* TOTAL PAGES */}

<div>
  <label className="mb-2 block text-sm font-semibold text-gray-700">
    Total Pages
  </label>

  <input
    type="number"
    name="totalPages"
    placeholder="250"
    value={
      formData.totalPages
    }
    onChange={handleChange}
    className="w-full rounded-2xl border border-gray-200 px-5 py-4 outline-none"
  />
</div>

{/* DISCOUNT % */}

<div>
  <label className="mb-2 block text-sm font-semibold text-gray-700">
    Discount %
  </label>

  <input
    type="number"
    name="discountPercentage"
    placeholder="20"
    value={
      formData.discountPercentage
    }
    onChange={handleChange}
    className="w-full rounded-2xl border border-gray-200 px-5 py-4 outline-none"
  />
</div>

{/* DISCOUNT EXPIRE */}

<div>
  <label className="mb-2 block text-sm font-semibold text-gray-700">
    Discount Expiry
  </label>

  <input
    type="date"
    name="discountExpiresAt"
    value={
      formData.discountExpiresAt
    }
    onChange={handleChange}
    className="w-full rounded-2xl border border-gray-200 px-5 py-4 outline-none"
  />
</div>