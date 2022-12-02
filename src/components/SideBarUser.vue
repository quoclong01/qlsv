<template>
    <div class="sidebarusers">
        <div class="title">
            HUCE Manager
            <router-link to="/" active-class="active" tag="button" class="side-btn">
            <div class="logout">
                Đăng xuất
            </div>
            </router-link>
        </div>


        <div class="menu-items">

            <router-link to="/evaluationtt" active-class="active" tag="button" class="side-btn">
            <div class="link-container"> 
                 Đánh giá thực tập tốt nghiệp
            </div>
            </router-link>

            <router-link to="/evaluationda" active-class="active" tag="button" class="side-btn">
            <div class="link-container"> 
                 Đánh giá đồ án tốt nghiệp
            </div>
            </router-link>


            
        </div>
    </div>
</template>

<script>
export default {
    
}
</script>


<style>
/* .title{
    text-align: center;
    color: white;
    font-size: 24px;
    margin-top: 10px;
} */
.menu-items{
    display: flex;
    flex-direction: column;
    margin-top: 40px;
   
}

/* .menu-items > * {
    margin-top: 30px;
} */


.link-container {
    display: inline-block;
    /* width: -webkit-fill-available; */
    /* background-color:white; */
    margin-bottom: 7px;
    /* border-radius: 4px; */
    font-weight: 500;
    height: 30px;
    margin-left: 3px;
}

.side-btn:focus{
    outline: none;
}
.side-btn.active{
    background-color: white;
    color: teal;
    font-weight: 500;
}
.side-btn{
    border: none;
    padding: 16px 0px;
    cursor: pointer;
    font-size: 16px;
    color: white;
    background-color: transparent;
}

</style>