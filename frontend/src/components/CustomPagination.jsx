import { Pagination } from "react-bootstrap";

function CustomPagination({ itemsPerPage, totalItems, activePage, paginate }) {
  const pageNumbers = [];
  const items = [];

  for (
    let number = 1;
    number <= Math.ceil(totalItems / itemsPerPage);
    number++
  ) {
    // pageNumbers.push(number);
    items.push(
      <Pagination.Item
        key={number}
        active={number === activePage}
        onClick={() => paginate(number)}
      >
        {number}
      </Pagination.Item>
    );
  }

  return (
    <>
      {/* <nav>
        <ul className="pagination">
          {pageNumbers.map((number) => (
            <li key={number} className="page-item">
              <a href="!#" className="page-link">
                {number}
              </a>
            </li>
          ))}
        </ul>
      </nav> */}
      <Pagination>{items}</Pagination>
    </>
  );
}

export default CustomPagination;
