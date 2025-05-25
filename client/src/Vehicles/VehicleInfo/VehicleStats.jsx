import Table from "react-bootstrap/Table";

export function VehicleStats({ id, entries }) {
  let totalCosts = 0;
  let categoryStats = [];
  //factory function to create objects with category name & total cost
  function newCat(category, cost) {
    return { category, cost };
  }

  //if category doesn't exist, add it & add costs too for each one
  //doing .includes first should be faster with larger datasets since categories will repeat more and more
  //check entry[i].category, if categoryStats contains it, add entry[i].cost to that one, else call newCat and add the cost
  for (let i = 0, j = entries.length; i < j; i++) {
    const index = categoryStats.findIndex((entry) => entry.category === entries[i].category,);
    if (index === -1) {
      categoryStats.push(newCat(entries[i].category, entries[i].cost));
      totalCosts += entries[i].cost;
    } else {
      categoryStats[index].cost += entries[i].cost;
      totalCosts += entries[i].cost;
    }
  }

  console.log(categoryStats);

  return (
    <>
      <div className='totalCost'>Total spent: {totalCosts} Kč</div>
      <div className='spendingTable'>
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>Category</th>
              <th>Cost</th>
            </tr>
          </thead>
          <tbody>
            {categoryStats.map(cat =>
              <tr key={cat.category}>
                <td>{cat.category}</td>
                <td>{cat.cost} Kč</td>
              </tr>
            )}
            
          </tbody>
        </Table>
      </div>
    </>
  );
}