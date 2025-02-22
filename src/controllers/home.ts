export const HomeController = function (req, res) {
  // const title = 'Desafio OZMap'
  // const menu = {
  //   users: '/users',
  //   regions: '/regions',
  //   search: '/search'
  // }

  // const params = {title, menu}
  const params = {}
  res.render('home', params)
}