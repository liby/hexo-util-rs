use crate::traits::IntoString;
use napi::bindgen_prelude::*;
use scraper::{Html, Selector};

#[napi(object)]
#[derive(Debug)]
pub struct TocObj {
  pub text: String,
  pub id: String,
  pub level: u8,
}

#[napi]
pub fn toc_obj(
  #[napi(ts_arg_type = "Buffer | string")] input: Either3<Buffer, String, Unknown>,
) -> Result<Vec<TocObj>> {
  let input = input.to_string()?;
  let root = Html::parse_fragment(&input);
  let selector = Selector::parse("h1,h2,h3,h4,h5,h6").unwrap();

  Ok(
    root
      .select(&selector)
      .into_iter()
      .map(|element| {
        let id = element
          .value()
          .id()
          .map(|element| element.to_string())
          .unwrap_or_else(|| {
            element
              .parent()
              .map(|ele| ele.value().as_element().unwrap().id().unwrap())
              .unwrap()
              .to_string()
          });
        TocObj {
          text: element.text().collect::<String>(),
          id,
          level: match element.value().name() {
            "h1" => 1,
            "h2" => 2,
            "h3" => 3,
            "h4" => 4,
            "h5" => 5,
            "h6" => 6,
            _ => 1,
          },
        }
      })
      .collect::<Vec<TocObj>>(),
  )
}

// pub fn toc_obj_vis(input: &str) -> Vec<TocObj> {
//   let root = Vis::load(input).unwrap();
//   let headers = root.find("h1,h2,h3,h4,h5,h6");
//   headers
//     .into_iter()
//     .map(|element| {
//       let id = if element.has_attribute("id") {
//         element
//           .get_attribute("id")
//           .map(|ele| ele.to_string())
//           .unwrap()
//       } else {
//         element
//           .parent()
//           .map(|element| {
//             element
//               .get_attribute("id")
//               .map(|ele| ele.to_string())
//               .unwrap()
//           })
//           .unwrap()
//       };
//
//       TocObj {
//         text: element.text(),
//         id,
//         level: match &*element.tag_name() {
//           "H1" => 1,
//           "H2" => 2,
//           "H3" => 3,
//           "H4" => 4,
//           "H5" => 5,
//           "H6" => 6,
//           _ => 1,
//         },
//       }
//     })
//     .collect::<Vec<TocObj>>()
// }
//
// pub fn toc_obj_scraper(input: &str) -> Vec<TocObj> {
//   let root = Html::parse_fragment(input);
//   let selector = Selector::parse("h1,h2,h3,h4,h5,h6").unwrap();
//
//   root
//     .select(&selector)
//     .into_iter()
//     .map(|element| {
//       let id = element
//         .value()
//         .id()
//         .map(|element| element.to_string())
//         .unwrap_or_else(|| {
//           element
//             .parent()
//             .map(|ele| ele.value().as_element().unwrap().id().unwrap())
//             .unwrap()
//             .to_string()
//         });
//       TocObj {
//         text: element.text().collect::<String>(),
//         id,
//         level: match element.value().name() {
//           "h1" => 1,
//           "h2" => 2,
//           "h3" => 3,
//           "h4" => 4,
//           "h5" => 5,
//           "h6" => 6,
//           _ => 1,
//         },
//       }
//     })
//     .collect::<Vec<TocObj>>()
// }
//
// pub fn toc_obj_nipper(input: &str) -> Vec<TocObj> {
//   let document = Document::from(input);
//
//   document
//     .select("h1,h2,h3,h4,h5,h6")
//     .iter()
//     .into_iter()
//     .map(|element| {
//       let id = element
//         .attr("id")
//         .map(|element| element.to_string())
//         .unwrap_or_else(|| {
//           element
//             .parent()
//             .attr("id")
//             .map(|element| element.to_string())
//             .unwrap()
//         });
//       TocObj {
//         text: element.text().to_string(),
//         id,
//         level: match &*element.get(0).unwrap().node_name().unwrap().to_lowercase() {
//           "h1" => 1,
//           "h2" => 2,
//           "h3" => 3,
//           "h4" => 4,
//           "h5" => 5,
//           "h6" => 6,
//           _ => 1,
//         },
//       }
//     })
//     .collect::<Vec<TocObj>>()
// }
//
// #[cfg(test)]
// mod tests {
//   use super::*;
//   use test::Bencher;
//
//   #[test]
//   fn it_work() {
//     let html = r#"
//     <h1 id="title_1">Title 1</h1>
//     <div id="title_1_1">
//       <h2>Title 1.1</h2>
//     </div>
//     <h3 id="title_1_1_1">Title 1.1.1</h3>
//     <h2 id="title_1_2">Title 1.2</h2>
//     <h2 id="title_1_3">Title 1.3</h2>
//     <h3 id="title_1_3_1">Title 1.3.1</h3>
//     <h1 id="title_2">Title 2</h1>
//     <h2 id="title_2_1">Title 2.1</h2>
//     <h1 id="title_3">Title should escape &, ', < and "</h1>
//     <h1 id="title_4"><a name="chapter1">Chapter 1 should be printed to toc</a></h1>
//     "#;
//     let document = Document::from(html);
//
//     document
//       .select("h1,h2,h3,h4,h5,h6")
//       .iter()
//       .for_each(|athing| {
//         println!("{}", athing.text());
//         println!();
//       });
//   }
//
//   #[bench]
//   fn bench_scraper(b: &mut Bencher) {
//     let html = r#"
//     <h1 id="title_1">Title 1</h1><div id="title_1_1"><h2>Title 1.1</h2></div><h3 id="title_1_1_1">Title 1.1.1</h3><h2 id="title_1_2">Title 1.2</h2><h2 id="title_1_3">Title 1.3</h2><h3 id="title_1_3_1">Title 1.3.1</h3><h1 id="title_2">Title 2</h1><h2 id="title_2_1">Title 2.1</h2><h1 id="title_3">Title should escape &, ', < and "</h1><h1 id="title_4"><a name="chapter1">Chapter 1 should be printed to toc</a></h1>
//     "#;
//     b.iter(|| toc_obj_scraper(html));
//   }
//
//   #[bench]
//   fn bench_vis(b: &mut Bencher) {
//     let html = r#"
//     <h1 id="title_1">Title 1</h1><div id="title_1_1"><h2>Title 1.1</h2></div><h3 id="title_1_1_1">Title 1.1.1</h3><h2 id="title_1_2">Title 1.2</h2><h2 id="title_1_3">Title 1.3</h2><h3 id="title_1_3_1">Title 1.3.1</h3><h1 id="title_2">Title 2</h1><h2 id="title_2_1">Title 2.1</h2><h1 id="title_3">Title should escape &, ', < and "</h1><h1 id="title_4"><a name="chapter1">Chapter 1 should be printed to toc</a></h1>
//     "#;
//     b.iter(|| toc_obj_vis(html));
//   }
//
//   #[bench]
//   fn bench_nipper(b: &mut Bencher) {
//     let html = r#"
//     <h1 id="title_1">Title 1</h1><div id="title_1_1"><h2>Title 1.1</h2></div><h3 id="title_1_1_1">Title 1.1.1</h3><h2 id="title_1_2">Title 1.2</h2><h2 id="title_1_3">Title 1.3</h2><h3 id="title_1_3_1">Title 1.3.1</h3><h1 id="title_2">Title 2</h1><h2 id="title_2_1">Title 2.1</h2><h1 id="title_3">Title should escape &, ', < and "</h1><h1 id="title_4"><a name="chapter1">Chapter 1 should be printed to toc</a></h1>
//     "#;
//     b.iter(|| toc_obj_nipper(html));
//   }
// }
