<style scoped>
.content{
    width: 60%;
    margin-left: 20%;
    margin-top: 30px;
    background-color: white;
    padding-bottom: 30px;
}
.news-img{
    width: 90%;
    height: 200px;
}
.finish-button{
    margin-top: 20px;
}
</style>
<template>
  <div class="content">
      <h2>Stone Age People in South Africa Unharmed by Supervolcano Eruption</h2>
      <span>难度：雅思/托福/专四单词：533读后感：104来源：VOA</span><br>
      <img src="../../res/img/news/news.png" class="news-img"/>
      <span class="news-text">
  WASHINGTON —
A supervolcano eruption about 74,000 years ago on Indonesia's island of Sumatra caused a large-scale environmental calamity that may have decimated Stone Age human populations in parts of the world. But some populations, it seems, endured it unscathed.
Scientists on Monday said excavations at two nearby archeological sites on South Africa's southern coast turned up microscopic shards of volcanic glass from the Mount Toba eruption, which occurred about 5,500 miles (9,000 km) away.
While some research indicates the eruption may have triggered a decades-long "volcanic winter" that damaged ecosystems and deprived people of food resources, the scientists found evidence that the hunter-gatherers at these sites continued to thrive.
The shards were found at a rock shelter located on a promontory called Pinnacle Point near the town of Mossel Bay where people lived, cooked food and slept, and at an open-air site 6 miles (10 km) away where people fashioned tools of stone, bone and wood.
The rock shelter was inhabited from 90,000 to 50,000 years ago. The researchers found no signs of abandonment at the time of the eruption, but rather evidence of business as usual.
"It is very possible that populations elsewhere suffered badly," said paleoanthropologist Curtis Marean of Arizona State University's Institute of Human Origins and Nelson Mandela University's Center for Coastal Palaeoscience in South Africa.
The researchers said the seaside location may have provided a refuge, with marine food sources like shellfish less sensitive than inland plants and animals to an eruption's environmental effects.
Members of a research team are pictured conducting excavations at the Vleesbaai archeological site on the south coast of South Africa where humans made stone tools about 74,000 years ago in this 2016 photo released March 12, 2018.
Members of a research team are pictured conducting excavations at the Vleesbaai archeological site on the south coast of South Africa where humans made stone tools about 74,000 years ago in this 2016 photo released March 12, 2018.
Mount Toba belched immense amounts of volcanic particles into the atmosphere to spread worldwide, dimming sunlight and potentially killing many plants. It was the most powerful eruption in the past 2 million years and the strongest since our species first appeared in Africa roughly 300,000 years ago.
Scientists are divided over the eruption's impact. Some think it may have caused a human population collapse that became a near-extinction event. Others believe its effects were less severe.
"On a regular basis through time, humans faced dire threats from natural disasters. As hunter-gatherers endowed with advanced cognition and a proclivity to cooperate, we were able to make it through this disaster, and we were very resilient," said Marean, who led the study published in the journal Nature.
"But this may not be the case now with our reliance on our highly complicated technological system. In my opinion, a volcano like this could annihilate civilization as we know it. Are we ready?"
      </span><br>
       <Button type="success" size="large" class="finish-button" @click="onFinish">完成阅读</Button>
  </div>
</template>
      
<script>
export default {
  name: "newsDetail",
  methods:{
      onFinish(){
                this.$Notice.success({
                    title: '完成阅读,积分增加30点!'
                });
      }
  }
};
</script>